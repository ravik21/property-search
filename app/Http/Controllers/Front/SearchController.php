<?php

namespace App\Http\Controllers\Front;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App, \Session, Cache, DB, Auth;
use App\Models\Property;
use App\Helpers\PropertySearchHelper;
use App\Models\Currency;
use App\Models\City;
use App\Models\Area;
use App\Models\Country;
use App\Helpers\CommonHelper;
use App\Models\Language;
use \Carbon\Carbon;
use Mobile_Detect;
use App\User;
use App\Models\Advertisement;

class SearchController extends Controller
{
  public $filters = [
      'proTypeFilter' => 'PropertyType',
      'buyRentFilter' => 'BuyRent',
      'priceFilter' => 'Price',
      'sizeFilter' => 'Size',
      'featuresFilter' => 'Views',
      'viewFilter' => 'Proximities',
      'proxFilter' => 'Features'
  ];

  public $typeIcons = [
      'apartment'         => 'flaticon-building',
      'family_town_house' => 'flaticon-home-1',
      'house'             => 'flaticon-internet',
      'cottage'           => 'flaticon-buildings-2',
      'commercial'        => 'flaticon-front',
      'land'              => 'flaticon-buildings-1',
      'farm_ranches'      => 'flaticon-home',
      'parking'           => 'flaticon-transport-2',
      'castle'            => 'flaticon-monument',
      'island'            => 'flaticon-beach',
      'timeshare'         => 'flaticon-luxury',
  ];

  public $icons = [
      'sale'        => 'flaticon-for-sale',
      'rent'        => 'flaticon-house-with-a-signal-with-dollar-symbol',
      'sold'        => 'flaticon-sold',
      'development' => ''
  ];

  public $sortOptions = [
      'new' => ['property.created_at', 'desc'],
      'cheap' => ['property.price', 'asc'],
      'priced' => ['property.price', 'desc'],
      'area_asc' => ['countries.name_en', 'asc'],
      'area_desc' => ['countries.name_en', 'desc'],
      'street_address_asc' => ['property.street_address', 'asc'],
      'street_address_desc' => ['property.street_address', 'desc'],
      'biggest_desc' => ['property.total_living_area', 'desc'],
      'biggest_asc' => ['property.total_living_area', 'asc'],
      'garden_size_asc' => ['property.total_garden_area', 'asc'],
      'garden_size_desc' => ['property.total_garden_area', 'desc'],
      'price_sqm_asc' => ['CEIL(property.price / property.total_living_area)', 'asc'],
      'price_sqm_desc' => ['CEIL(property.price / property.total_living_area)', 'desc'],
      'rent_asc' => ['monthly_fee', 'asc'],
      'rent_desc' => ['monthly_fee', 'desc'],
      'built' => ['property.build_year', 'desc']
  ];

  public function getIndex(Request $request, $buy = null, $page = 'locations',  $country = null, $city = null)
  {
    if(!in_array($page, [trans('common.locations'),trans('common.listings'),trans('common.gallery'), trans('common.gridlist')])) return view('errors.404');

    $data['share_link'] = URL(SITE_LANG .'/'. trans('common.'.$buy) .'/property/'.$page);
    $data['activePage'] = $page;

    if(in_array($page, [trans('common.gallery'),trans('common.gridlist')]))
        $data['gridlist'] = $page == trans('common.gridlist') ? true : false ;

    $view = $this->views()[$page];
    $data['view_type'] = $view['view_type'];

    $data['show_search_bar'] = $page == trans('common.listings') ? false : true;
    $data['disablefooter'] = true;

    $view = $view['view'];

    $request->offsetSet('site_lang',App::getLocale());

    $controller = new SearchController;
    $controller->setLocationWithData($request, $buy, $country, $city);

    if(is_array($request->lats) && is_array($request->lngs))
    {
      $lats = implode(',',$request->lats);
      $lngs = implode(',',$request->lngs);
      $request->offsetSet('lats', $lats);
      $request->offsetSet('lngs', $lngs);
    }

    $currency = CommonHelper::getAppCurrency(false, true);

    $request->offsetSet('currency',$currency->currency);

    $data['request'] = $request->all();
    $data['zoom'] = 5;
    $data['currency'] = $currency;

    $data['filters'] = $this->filters;

    $appUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] && !in_array(strtolower($_SERVER['HTTPS']),array('off','no'))) ? 'https' : 'http';
    $appUrl .= '://'.$_SERVER['HTTP_HOST'];

    if(env('APP_ENV') == 'production')
      $appUrl = str_replace(['http://'] , 'https://' , $appUrl);

    $data['appUrl'] = $appUrl;
    $data['address'] = isset($request['address']) ? $request['address'] : '';

    $cacheKey = [];

    foreach ($this->filters as $class => $dt) {
      $cacheKey[$dt] = md5(($dt == 'PropertyType' ? 'Type' : studly_case($dt)).'FilterHtml'.$request['site_lang'].'_'.json_encode($request->all()) );
    }

    $data['cacheKey'] = $cacheKey;

    return view($view, $data);
  }

  public function getPropertyLocations(Request $request)
  {
    $lang = $request->site_lang ? $request->site_lang : 'en';

    App::setLocale($lang);
    Session::put('currency', $request->site_curr);

    $cacheKey = md5('property_search_'.SITE_LANG.'_'.json_encode($request->all()));

    // if (Cache::has($cacheKey)) {
    //     $propertiesData = Cache::get($cacheKey);
    // }
    // else{
      $propertiesData = $this->getProperties($request);
    //   Cache::put($cacheKey, $propertiesData, 60 *24);
    // }

    $propertiesData['firstCall'] = $request->firstCall;

    return response($propertiesData);
  }

  private function views()
  {
    $views = [
        trans('common.locations') => ['view' => 'front.search.map.index','view_type' => 'Map'],
        trans('common.listings') => ['view' => 'front.search.list.index', 'view_type' => 'List'],
        trans('common.gallery') => ['view' => 'front.search.gallery.index', 'view_type' => 'Gallery'],
        trans('common.gridlist') => ['view' => 'front.search.gallery.index', 'view_type' => 'Gridlist']
    ];

    return $views;
  }

  private function getProperties($request)
  {
    $locations = Property::mainImagePropertiesFilter();

    if (CommonHelper::checkFiltersExist($request))
        $locations = PropertySearchHelper::applySearchFilters($request, $locations);

    $locations = $this->addCountryFilter($request, $locations);


    $locations = $this->getPropertiesInCurrentRegion($request, $locations);
    $locations = $this->propertiesSort($request, $locations);
    $locations = $locations->join('property_types', 'property.property_type_id', 'property_types.id');

    $paginateProps = clone $locations;
    $paginateProps = $paginateProps
        ->selectRaw(
            "property.id, agency_id,
            CONCAT('https:',property.main_image_url) as  main_image_url,
            price , price_currency_id , street_address , hide_street_address
            ,property.city_id , property.city , property.state_id , property.country_id , property.geo_lat , property.geo_lng
            ,property_type_id , mark_as_sold , status , rental_status , sale_status,total_living_area , total_living_area_type,
            CONCAT('https:',property.main_image_url_thumbnail_path) as main_image_url_thumbnail_path ,
            CONCAT('https:',property.main_image_url_mobile_path) as main_image_url_mobile_path,rooms,property_types.name as pt,
            property_types.search_key as sk , estate_agencies.public_name as pubName, estate_agencies.logo as agency_logo"
        )
        ->join('estate_agencies','property.agency_id','estate_agencies.id')
        ->paginate(11);


    $data['paginateProperties'] = (string) view('front.search.map.list', ['properties' => $paginateProps]);
    $data['nextPage'] = ($paginateProps->currentPage() + 1 > $paginateProps->lastPage()) ? false : ($paginateProps->currentPage() + 1);

    if(!$data['nextPage'])
      $data['no_result'] = (string) view('includes.no-property-result', ['locale' => $request->site_lang, 'page_type' => 'map']);

    if ($request->page) return $data;

    $data['locations'] = $locations
        ->selectRaw("
            property.geo_lat as gt, property.geo_lng as gl,
            property.id, property.street_address as sa,
            CONCAT('https:', property.main_image_url) as miu,
            property.rooms as rms,
            CONCAT('https:',property.main_image_url_mobile_path) as miump,
            property.total_living_area as ar,
            property.total_living_area_type as atyp,
            eur_price as pr, property_types.name as pt,
            CASE WHEN
                property.status = 'rent' and
                (property.monthly_fee != '' or property.rental_status != '')
                THEN 'rent'
                ELSE 'sale'
            END as tp
        ")
        ->inRandomOrder()
        ->limit(200)
        ->get();

    return $data;
  }

  private function addCountryFilter($requeshttps://github.com/ravik21/property-search-specific.gitt, $properties)
  {
    $country = !empty(SITE_COUNTRY) ? SITE_COUNTRY : ($request->iso ? $request->iso : $request->country);
    $locale  = $request->site_lang;
    $countryColumn = is_numeric($country) ? 'id' : ($request->iso ? 'iso' : 'name_'.$locale);
    $cityColumn    = 'name_'.$locale;

    if($request->city && $request->zoom > 10)
    {
      $city = City::where($cityColumn , $request->city)->first();
      if($city && !empty(SITE_COUNTRY))
      {
        $country       = $city->country_id;
        $countryColumn = 'id';
      }
    }

    if(!is_numeric($country))
      $countryDetail = Country::where($countryColumn, $country)->first();

    if(!empty($country))
      $properties = $properties->where('property.country_id', isset($countryDetail) && $countryDetail ? $countryDetail->id : $country );

    return $properties;
  }

  private function propertiesSort($request, $locations)
  {
    if (!empty($request->sort)) {
        $sortOptions = $this->sortOptions;

        if (isset($sortOptions[$request->sort]) && array_key_exists($request->sort, $sortOptions)) {
            if (preg_match('/area_/', $request->sort)) {
                $locations = $locations->leftJoin('countries', 'property.country_id', '=', 'countries.id');
            }

            if (preg_match('/price_sqm_/', $request->sort)) {
                $locations = $locations
                    ->orderByRaw($sortOptions[$request->sort][0] . ' ' . $sortOptions[$request->sort][1]);
            } else if (preg_match('/rent_/', $request->sort)) {
                $locations = $locations
                    ->where('monthly_fee', '<>', 0)
                    ->orderBy($sortOptions[$request->sort][0], $sortOptions[$request->sort][1]);
            } else {
                $locations = $locations
                ->orderBy($sortOptions[$request->sort][0], $sortOptions[$request->sort][1]);
            }
        }
    }

    return $locations;
  }

  private function getPropertiesInCurrentRegion($request, $locations)
  {
    if (!empty($request->lats) && is_array($request->lats) && !empty($request->lngs) && is_array($request->lngs)) {
        $locations = $locations->where(function($query) use ($request){
            $query->whereBetween('property.geo_lat', $request->lats);
        });
        $locations = $locations->where(function($query) use ($request){
            $query->whereBetween('property.geo_lng', $request->lngs);
        });
    }

    return $locations;
  }

  /*** Return nearby properties by zoom level distance. * * @return array*/
  private function selectedPropertiesByLatLng($request, $properties)
  {
    $radius = "( 6764 * acos(
        cos( radians(".$request->lat.") )
        * cos( radians( property.geo_lat ) )
        * cos( radians( property.geo_lng ) - radians(".$request->lng.") )
        + sin( radians(".$request->lat.") )
        * sin( radians( property.geo_lat ) )
    ) )";
    $nearestCheck = false;

    foreach (PropertySearchHelper::getZoomLevelDistances($request) as $distance) {
      $properties = $properties->whereRaw($radius .' < '. $distance);
      if (count($properties)) return $properties;
    }

    return $properties;
  }

  public function setLocationWithData($request,$buy, $country, $city)
  {
    if(!empty(SITE_COUNTRY)) $data['internationalUrl'] = 'https://test.co' . $_SERVER['REQUEST_URI'];

    $status = [
     strtolower(trans('common.sale')) => 'sale',
     strtolower(trans('common.rent')) => 'rent'
    ];

    if($buy != trans('common.buy') && (!$request->status || !is_array($request->status)) )
    {
      if(isset($status[strtolower($buy)]))
        $status = [$status[strtolower($buy)]];

      $request->offsetSet('status', $status);
    }

    if(!$request->status)
      $request->offsetSet('status', ['sale']);

    $detect = new Mobile_Detect;
    $mobileDetect = $detect->isMobile() ? true: false;

    $request->offsetSet('mobileDetect', $mobileDetect);

    if($request->lat && $request->lng)
    {
      $checkArray = [];

      $checkArray = ['lat','lng','status','site_lang','mobileDetect','zoom'];

      if(!count($request->except($checkArray))) return;

      $checkArray[] = 'agent_id';

      if(!count($request->except($checkArray))) return;

    }

    $request->offsetSet('zoom', 5);

    if(Session::has('siteDomain') && session('siteDomain') != SITE_DOMAIN) Session::forget('last_location');

    $request->offsetSet('country_name', $request->country);
    $country = !empty(SITE_COUNTRY) ? SITE_COUNTRY : ($request->iso ? $request->iso : $request->country);
    $locale  = $request->site_lang;

    $countryColumn = is_numeric($country) ? 'id' : ($request->iso ? 'iso' : strlen($request->country) <= 3 ? 'iso' : 'name_'.$locale);
    $cityColumn    = 'name_'.$locale;

    if(!$country)
    {
        if(!$request->city)
        {
          $request->offsetSet('city', 'Cannes');
          $cityColumn  = 'name_en';
        }
        $request->offsetSet('country', 'France');
        $countryColumn = 'name_en';
    }

    $request->offsetSet('zoom', 7);

    if(empty($request->lat) && empty($request->lng))
    {
      $city = City::where($cityColumn , $request->city)->first();

      if($city)
      {
        // $request->offsetSet('city', $city->id);
        // $request->offsetSet('city_name', $city->{'name_'.$locale});

        $results = json_decode($city->confirm_response, true);

        $confirmResponse = [];

        if(isset($results['results']))
        $confirmResponse = reset($results['results']);

        if(count($confirmResponse))
        {
          $bounds = $confirmResponse['geometry']['bounds'];
          $location = $confirmResponse['geometry']['location'];

          $lats = [ number_format($bounds['southwest']['lat'],4), number_format($bounds['northeast']['lat'],4) ];
          $lngs = [ number_format($bounds['southwest']['lng'],4), number_format($bounds['northeast']['lng'],4) ];

          $request->offsetSet('lats', $lats);
          $request->offsetSet('lngs', $lngs);

          $request->offsetSet('lat', $location['lat']);
          $request->offsetSet('lng', $location['lng']);

          $request->offsetSet('place_id', $confirmResponse['place_id']);
        }
      }

      if(!$city)
      {
        $country = Country::where($countryColumn, $request->country)->first();

        if ($country)
        {
          $request->offsetSet('country', $country->id);
          $request->offsetSet('iso', $country->iso);
          $request->offsetSet('country_name', $country->{'name_'.$locale});

          $confirmResponse = reset(json_decode($country->confirm_response, true)['results']);

          $bounds = $confirmResponse['geometry']['bounds'];
          $location = $confirmResponse['geometry']['location'];

          $lats = [ number_format($bounds['southwest']['lat'],4), number_format($bounds['northeast']['lat'],4) ];
          $lngs = [ number_format($bounds['southwest']['lng'],4), number_format($bounds['northeast']['lng'],4) ];

          $request->offsetSet('lats', $lats);
          $request->offsetSet('lngs', $lngs);

          $request->offsetSet('lat', $location['lat']);
          $request->offsetSet('lng', $location['lng']);


          $request->offsetSet('zoom', 7);
          $request->offsetSet('country', $country->id);
        }
      }
    }

    $price = array_where($request->all(), function ($value, $key) { return strpos($key, 'price') > -1; });
    $request->offsetSet('price', $price);

    $size = array_where($request->all(), function ($value, $key) {
        return strpos($key, 'rooms') > -1 || strpos($key, 'living') > -1 || strpos($key, 'gardens') > -1;
    });

    $request->offsetSet('size', $size);
  }

  public function getFilters(Request $request)
  {
    App::setLocale($request->siteLang);

    $cacheKey = md5('filters_search_'.SITE_LANG.'_'.json_encode($request->all()));

    // if (Cache::has($cacheKey))
    //     $data = Cache::get($cacheKey);
    // else {

      $landingPage = $request->landingPage ? $request->landingPage : false;
      $cacheKeys = json_decode($request->cacheKeys, true);

      foreach ($cacheKeys as $type => $cachekey) {
        foreach ($request->search_type as $key => $folder) {
          $newfolder = $folder == 'search' ? false : $folder;
          $view = PropertySearchHelper::{($type == 'PropertyType' ? 'Type' : studly_case($type)).'FilterHtml'}(null, $landingPage , $newfolder, $cachekey, true );
          $data['views'][$type][$folder] = $view;
        }
      }

      $data['request'] = $request->all();
    //   Cache::put($cacheKey, $data, 60*24);
    // }
    return $data;
  }

}
