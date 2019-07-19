<?php

namespace App\Helpers;

use Session, Cache, App;
use App\Models\Currency;
use App\Models\Language;
use App\Models\CurrencyRates;
use App\Models\SearchStatistics;
use App\Models\City;
use App\Models\Area;
use App\Models\Country;
use App\Models\Weather;
use App\Models\Property;
use App\Models\Features;
use App\Models\Services;
use App\Models\Proximities;
use App\Models\PropertyView;
use App\Models\PropertyTypes;
use App\Models\PropertyTexts;
use App\Models\PropertyTranslation;
use App\Models\PropertyImages;
use App\Models\View as PrpView;
use App\Models\PropertyFeatures;

class PropertySearchHelper
{
  public static function propertyDetailInfo($id, $locale , $type = false)
  {
    $data = [];
    $property = Property::selectRaw(
        'property.id ,
        CONCAT("https:",main_image_url) as main_image_url,
        property_types.name as type_name,
        property_types.search_key as search_key,
        property.country_id as country_id,
        property.state_id as state_id,
        property.city_id as city_id,
        property.geo_lat,
        property.geo_lng,
        property.price_on_request,
        property.price,
        property.price_currency,
        property.price_currency_id,
        property.rooms,
        property.created_at,

        property.monthly_fee,
        property.monthly_fee_currency,
        property.monthly_fee_currency_id,

        property.rent,
        property.rental_currency,
        property.rental_currency_id,
        property.rental_duration,

        property.rental_monthly_fee,
        property.rental_monthly_fee_currency,
        property.rental_monthly_fee_currency_id,

        property.mark_as_sold,
        property.status,
        property.rental_status,
        property.sale_status,
        property.total_living_area,
        property.total_living_area_type,
        property.total_garden_area,
        property.total_garden_area_type,
        property.build_year,
        property.agency_id,
        property.agent_id,
        property.property_url,

        CONCAT("https:",estate_agencies.logo) as  agency_logo,
        estate_agencies.public_name as agency_name'
        )
        ->join('property_types', 'property.property_type_id','=','property_types.id')
        ->join('estate_agencies', 'property.agency_id','=','estate_agencies.id')
        ->whereRaw('property.id = '. $id .' and (property.preview_mode = 1 or property.preview_mode = 2)')
        ->first();
    if ($property)
    {
       $texts = PropertyTranslation::select('subject','description','locale')
                                    ->join('property','property_translations.property_id','property.id')
                                    ->where('property_translations.property_id', $id)
                                    ->first();

       $services = Services::select('services.*')
                                    ->join('property_services','property_services.service_id', '=', 'services.id')
                                    ->where('property_services.property_id',$id)
                                    ->get();

        $weathers = Weather::select('weather.*','cities.id')
                                    ->join('cities', 'weather.city_id', 'cities.id')
                                    ->where('cities.id', isset($property->city_id) ? $property->city_id : null)
                                    ->where('deleted_at', NULL)
                                    ->groupBy('month')
                                    ->get();

        $features = Features::select('features.*')
                                    ->join('property_features','property_features.feature_id', '=', 'features.id')
                                    ->where('property_features.property_id',$id)
                                    ->where('deleted_at', null)
                                    ->get();

        $propViews = PrpView::select('views.*')
                                    ->join('property_views','property_views.view_id', '=', 'views.id')
                                    ->where('property_views.property_id',$id)
                                    ->where('deleted_at', null)
                                    ->get();

        $proximities = Proximities::select('proximities.*','property_proximity.distance as distance')
                                    ->join('property_proximity','property_proximity.proximity_id', '=', 'proximities.id')
                                    ->where('property_proximity.property_id',$id)
                                    ->where('deleted_at', null)
                                    ->get();

        $langAddress = $property->langAddress();

        $getFeatures = [];

        foreach ($features as $feature)
            $getFeatures[$feature->id] = $feature->number;

        $area    = Area::select('name','id')->where('id' , $property->area_id ? : NULL)->first();
        $city    = City::select('search_key','id')->where('id' , $property->city_id ? : NULL)->first();
        $country = Country::select('search_key','id')->where('id' , $property->country_id ? : NULL)->first();

        $data['with_search_bar'] = true;

        $data['property'] = $property;

        $data['texts']       = $texts ? : false;
        $data['services']    = $services;
        $data['weathers']    = $weathers->count() ? $weathers : false;
        $data['features']    = $features;
        $data['propViews']   = $propViews;
        $data['proximities'] = $proximities;


        $data['langAddress']   = $langAddress;
        $data['getFeatures']   = $getFeatures;

        $data['area']    = $area ? : false;
        $data['city']    = $city ? : false;
        $data['country'] = $country ? : false;

        $images = PropertyImages::join('property','property_images.property_id', 'property.id')
                              ->join('image_data','property_images.id','image_data.image_id')
                              ->join('image_data_feature', 'image_data.image_data_feature_id', 'image_data_feature.id')
                              ->where('property_images.property_id', $id)
                              ->where('property_images.deleted_at', NULL)
                              ->orderby('property_images.main_image', 'asc');


        $propImages = clone $images;
        $propImages = $propImages->selectRaw("property_images.id,
                               CONCAT('https:',property_images.s3_url) as s3_url,
                               property_images.main_image,
                               property_images.property_id,
                               CONCAT('https:',property_images.s3_mobile_path) as s3_mobile_path,
                               CONCAT('https:',property_images.s3_thumbnail_path) as s3_thumbnail_path,
                               image_data_feature.feature_name"
                              );

        $imageRecognition = clone $images;
        $imageRecognition = $imageRecognition->groupBy('image_data.image_data_feature_id')->selectRaw("image_data_feature.feature_name")->get();

        $data['propertyImagesWithMainImage'] = $propImages->where('property_images.s3_url','!=', '')->groupBy('property_images.id')->get();
        $data['imageRecognition'] = $imageRecognition;
        $data['detailPageURL'] = $data['property']->detailPageURL(true);
    }

    return $data;
  }

  public static function applySearchFilters($request, $properties)
  {
    $properties = self::typeFilter($request->type, $properties);//Filter search property type
    $properties = self::statusesFilter($request->status, $properties);//Filter search sell/buy
    $properties = self::priceFilter($request, $properties);//Filter search property price
    $properties = self::sizeFilter($request, $properties);//Filter search property size
    $properties = self::viewsFilter($request->views, $properties);//Filter search views
    $properties = self::proximitiesFilter($request->proximities, $properties);//Filter search proximities
    $properties = self::featuresFilter($request->features, $properties);//Filter search features

    if($request->agency_id)
      $properties = $properties->where('property.agency_id' , $request->agency_id);

    return $properties;
  }

  public static function typeFilter($type, $properties)
  {
    if (!empty($type) && is_array($type)) {
      $properties = $properties->join('property_types as p_types', function($join) use($type){
          $join->on('property.property_type_id', '=', 'p_types.id')->whereIn('p_types.search_key', $type);
      });
    }
    return $properties;
  }

  public static function statusesFilter($statuses, $properties)
  {
    if (!empty($statuses) && is_array($statuses)) {

      $properties = $properties
          ->where(function($query) use($statuses) {
              $found = false;

              if (in_array('sale', $statuses)) {
                  $query->where(function($innerQuery) use ($found){
                      $innerQuery
                          ->where('property.status', 'sale')
                          ->orWhere('property.sale_status', '!=', '');
                  });
                  $found = true;
              }

              if (in_array('rent', $statuses)) {
                  $query->where(function($innerQuery) use ($found){
                      $innerQuery
                          ->{$found ? 'orWhere' : 'where'}('property.status','rent')
                          ->Orwhere('property.rental_status' ,'!=', '')
                          ->Orwhere('property.monthly_fee','!=','');
                  });
                  $found = true;
              }

              if (in_array('sold', $statuses)) {
                  $query->where(function($innerQuery) use ($found){
                      $innerQuery
                          ->{$found ? 'orWhere' : 'where'}('property.mark_as_sold', 1)
                          ->orWhere('property.status', 'sold');
                  });
              }

              if (in_array('development', $statuses)) {
                  $query->where('property.development', '1');
              }
      });
    }

    return $properties;
  }

  public static function priceFilter($request, $properties)
  {
    if (!empty($request->min_price) || !empty($request->max_price)) {
      $currencyId = Session::has('currency') ? Session::get('currency') : ($request->site_curr ?: 10);
      $exchangeRate = self::getCurrencyRates($currencyId);

      if (!$exchangeRate) $exchangeRate = self::getCurrencyRates();

      $havingQuery = 'property.eur_price ';

      if (!empty($request->min_price) && empty($request->max_price) )
          $havingQuery .= '>= '. ($request->min_price / $exchangeRate->exchange_rate);
      else if(empty($request->min_price) && !empty($request->max_price))
          $havingQuery .= '<= '. ($request->max_price / $exchangeRate->exchange_rate);
      else
          $havingQuery .= 'BETWEEN '. ($request->min_price / $exchangeRate->exchange_rate) .' AND '. ($request->max_price / $exchangeRate->exchange_rate);

      $properties = $properties->whereRaw($havingQuery);
    }

    if (!empty($request->monthly_min_price) || !empty($request->monthly_max_price)) {
        $currency = $request->site_curr ?: 'USD';
        $exchangeRate = CurrencyRates::select('exchange_rate')->where('base_currency_id', 'EUR')->where('convert_currency_id', $currency)->first();
        $havingQuery = ($currency != 'EUR' && $exchangeRate) ?  '(property.eur_monthly_fee / '. $exchangeRate->exchange_rate .') ' : 'eur_monthly_fee ';

        if (!empty($request->monthly_min_price) && empty($request->monthly_max_price) )
            $havingQuery .= '>= '. $request->monthly_min_price;
        else if(empty($request->monthly_min_price) && !empty($request->monthly_max_price))
            $havingQuery .= '<= '. $request->monthly_max_price;
        else
            $havingQuery .= 'BETWEEN '. $request->monthly_min_price .' AND '. $request->monthly_max_price;

            $properties = $properties->whereRaw($havingQuery);
    }

  /*
  if (!empty($prices['sqm_min_price']) || !empty($prices['sqm_max_price'])) {

  $string .= '<p>Price / Sqm : '.($prices['sqm_min_price'] ? 'Min $ '.$prices['sqm_min_price'].' ' : ''). ($prices['sqm_max_price'] ? 'Max $ '.$prices['sqm_max_price'] : '').'</p>';
  $propertiesJoin = self::getPriceSqmJoin();

  $maxPrice = !empty($prices['sqm_max_price']) ? $prices['sqm_max_price'] : $propertiesJoin->max('price_sqm');
  $minPrice = !empty($prices['sqm_min_price']) ? $prices['sqm_min_price'] : $propertiesJoin->min('price_sqm');

  $propertyIds = $propertiesJoin->filter(function ($value, $key) use($maxPrice, $minPrice) {
                                      return $value->price_sqm >= $minPrice && $value->price_sqm <= $maxPrice ;
                                  });

  $properties = $properties->whereIn('property.id', $propertyIds);
  }
  */

    return $properties;
  }

  public static function sizeFilter($request, $properties)
  {
    if (!empty($request->rooms_min) || !empty($request->rooms_max)) {

        $minRooms = $request->rooms_min;
        $maxRooms = $request->rooms_max;

        if (!empty($minRooms) && empty($maxRooms))
            $properties = $properties->where('property.rooms', '>=', $minRooms);
        elseif (empty($minRooms) && !empty($maxRooms))
            $properties = $properties->where('property.rooms', '<=', $maxRooms);
        else
            $properties = $properties->whereBetween('property.rooms', [ $minRooms, $maxRooms ]);
    }

    if (!empty($request->living_min) || !empty($request->living_max))
        $properties = self::getSizeBetweenPropertyIds($properties, $request->living_min, $request->living_max, 'total_living_area');

    if (!empty($request->gardens_min_sqm) || !empty($request->gardens_max_sqm))
        $properties = self::getSizeBetweenPropertyIds($properties, $request->gardens_min_sqm, $request->gardens_max_sqm, 'total_garden_area');

    return $properties;
  }

  public static function viewsFilter($views, $properties)
  {
    if (!empty($views)) {
        $viewIds = PropertySearchHelper::getIdsBySearchKey(new PrpView, $views);
        $countViewIds = count($viewIds);
        $viewIds = (count($viewIds) == '1')?  $viewIds[0] : implode(',', $viewIds->toArray());
        $properties = $properties->join(
                                    \DB::raw("
                                        (SELECT property_id
                                        FROM property_views
                                        WHERE view_id IN (". $viewIds .") and deleted_at IS NULL
                                        GROUP BY property_id
                                        HAVING COUNT(property_id) >= ". $countViewIds ."
                                        ) property_views
                                    "),
                                    'property.id', '=', 'property_views.property_id');
    }

    return $properties;
  }

  public static function proximitiesFilter($proximities, $properties)
  {
    if (!empty($proximities)) {
        $proximitiesIds = PropertySearchHelper::getIdsBySearchKey(new Proximities, $proximities);
        $countProximitiesIds = count($proximitiesIds);
        $proximitiesIds = (count($proximitiesIds) == '1') ?  $proximitiesIds[0] : implode(',', $proximitiesIds->toArray());
        $properties = $properties->join(
                                    \DB::raw("
                                        (SELECT property_id
                                        FROM property_proximity
                                        WHERE proximity_id IN (". $proximitiesIds .") and deleted_at IS NULL
                                        GROUP BY property_id
                                        HAVING COUNT(property_id) >= ". $countProximitiesIds ."
                                        ) property_proximity
                                    "),
                                    'property.id', '=', 'property_proximity.property_id');
    }

    return $properties;
  }

  public static function featuresFilter($features, $properties)
  {
    if (!empty($features)) {
        $featureIds =  PropertySearchHelper::getIdsBySearchKey(new Features, $features);
        $countFeatureIds = count($featureIds);
        $featureIds = (count($featureIds) == '1')?  $featureIds[0] : implode(',', $featureIds->toArray());

        $properties = $properties->join(
                                    \DB::raw("
                                        (SELECT property_id
                                        FROM property_features
                                        WHERE feature_id IN (". $featureIds .") and deleted_at IS NULL
                                        GROUP BY property_id
                                        HAVING COUNT(property_id) >= ". $countFeatureIds ."
                                        ) property_feature
                                    "),
                                    'property.id', '=', 'property_feature.property_id');
    }

    return $properties;
  }

  public static function getMinMaxRooms()
  {
    // if (Cache::has('propertyFeaturesMinMax'))
    //     $propertyFeaturesMinMax = Cache::get('propertyFeaturesMinMax');
    // else {
        $propertyFeaturesMinMax = Property::selectRaw('MIN(rooms) as min, MAX(rooms) as max')->first();
    //     Cache::put('propertyFeaturesMinMax', $propertyFeaturesMinMax, 24*60);
    // }

    $min = $propertyFeaturesMinMax->min ?: 1;
    $max = $propertyFeaturesMinMax->max ?: 1;

    $rooms = [];

    if($max > 100) $max = 100;

    for ($i = 1; $i <= $max; $i++) {
        array_push($rooms, $i);
    }

    return $rooms;
  }

  public static function saveSearch($request)
  {
    $filtersData = self::getFilterData($request);

    if (empty($filtersData)) {
        return;
    }

    $srchStats = new SearchStatistics;
    $filterStr = ['type', 'status', 'price', 'size', 'views', 'proximities', 'features'];

    foreach ($filterStr as $str) {
        $srchStats->{'property_'. $str} = !empty($filtersData[$str]) ? json_encode($filtersData[$str]) : null;
    }

    $srchStats->save();
  }

  public static function getMinPriceSqm()
  {
    // if (Cache::has('minPriceSqm')) return Cache::get('minPriceSqm');
    $properties = self::getPriceSqmJoin();
    $min = $properties->min('price_sqm');
    $max = $properties->max('price_sqm');
    $calcDiff = self::calculatePriceDiff($min, $max);
    // Cache::put('minPriceSqm', $calcDiff, 5);
    return $calcDiff;
  }

  public static function getPriceSqmJoin()
  {
    $properties = Property::mainImagePropertiesFilter();
    return $properties->selectRaw('property.id, CEIL(property.price / property.total_living_area) as price_sqm')->get();
  }

  public static function getGardenSqmJoin()
  {
    // if(Cache::has('GardenSqmJoin')) return Cache::get('GardenSqmJoin');
    $properties = Property::mainImagePropertiesFilter();
    $properties = $properties->join('property_features', function($join){
                                  $join->on('property.id', '=', 'property_features.property_id');
                              })->join('features', function($join){
                                  $join->on('property_features.feature_id', '=', 'features.id')->where('search_key', 'garden');
                              })->get();

    // Cache::put('GardenSqmJoin', $properties, 24*60);
    return $properties;
  }

  public static function getMinMaxGardenSqm()
  {
    $totalGardenSqm = self::getSizeMinMax('total_garden_area');
    return self::calculateGardenAreaIntervals($totalGardenSqm->min, $totalGardenSqm->max);
  //   return self::calculatePriceDiff($totalGardenSqm->min, $totalGardenSqm->max);
  }

  public static function salePriceMinMaxValues()
  {
    $currency = CommonHelper::getAppCurrency(false, true);

    if (empty($currency))
        return [];

    $currency = $currency->id;

    // if (Cache::has('propertiesSalePriceIntervals_'. $currency)) {
    //     return Cache::get('propertiesSalePriceIntervals_'. $currency);
    // }

    $priceInterval = Currency::select('intervals')
        ->where('currency_id', $currency)
        ->join('price_intervals', 'currencies.id', '=', 'price_intervals.currency_id')
        ->first();

    $intervals = isset($priceInterval) ? explode(',', $priceInterval->intervals) : [];
    unset($intervals[0]);
    // Cache::put('propertiesSalePriceIntervals_'. $currency, $intervals, 24*60);

    return $intervals;
  }

  public static function monthlyFeeMinMaxValues()
  {
    $currency = CommonHelper::getAppCurrency(false, true);
    if (!isset($currency) || !isset($currency->currency))
      return [];

    $currency = $currency->currency;

    // if (Cache::has('propertiesMonthlyPriceIntervals_'. $currency))
    //     return Cache::get('propertiesMonthlyPriceIntervals_'. $currency);

    $priceInterval = Currency::select('intervals')->where('currency', $currency)->join('monthly_fee_intervals', 'currencies.id', '=', 'monthly_fee_intervals.currency_id')->first();
    $intervals = isset($priceInterval) ? explode(',', $priceInterval->intervals) : [];
    unset($intervals[0]);
    // Cache::put('propertiesMonthlyPriceIntervals_'. $currency, $intervals, 24*60);
    return $intervals;
  }

  public static function calculatePriceDiff($min, $max)
  {
    $priceDiff = $max-$min;
    $priceRange = [];

    if (empty($priceDiff) && $min > 0) array_push($priceRange, $min);
    if (empty($priceDiff)) return $priceRange;

    for ($i=0; $i != 16; $i++) {
        if(empty($priceDiff/15*$i + $min)) continue;
        array_push($priceRange, ceil($priceDiff/15*$i + $min));
    }

    return $priceRange;
  }

  public static function calculateLivingAreaIntervals($min, $max)
  {
    $areaRange  = [];
    $areaDiff = $max - $min;

    if($areaDiff > 5){

        $intervalStart = 5;

        array_push($areaRange, $intervalStart );

        for ($i=0; $intervalStart < $max; $i++) {
            if($intervalStart == 5 )      $diff = 5 ;
            if($intervalStart == 100 )    $diff = 100 ;
            if($intervalStart == 1000 )    $diff = 1000 ;
            if($intervalStart == 10000 )    $diff = 10000 ;
            if($intervalStart == 100000 )    $diff = 10000 ;
            if($intervalStart == 1000000 )    $diff = 100000 ;
            if($intervalStart == 10000000 )    $diff = 10000000 ;
            if($intervalStart == 100000000 )    $diff = 100000000 ;
            if($intervalStart == 1000000000 )    $diff = 1000000000 ;
            if($intervalStart == 10000000000 )    $diff = 10000000000 ;
            if($intervalStart == 100000000000 )    $diff = 100000000000 ;
            $intervalStart = $intervalStart + $diff;

            if($intervalStart < $max)
              array_push($areaRange, $intervalStart );
            else
              $intervalStart = $max;
        }

        array_push($areaRange, round($intervalStart/10)*10 );
    }

    return $areaRange;
  }

  public static function calculateGardenAreaIntervals($min, $max)
  {
    $areaRange  = [];
    $areaDiff = $max - $min;

    if($areaDiff > 100){

        $intervalStart = 100;

        array_push($areaRange, $intervalStart );

        for ($i=0; $intervalStart < $max; $i++) {
            if($intervalStart == 5 )      $diff = 5 ;
            if($intervalStart == 100 )    $diff = 100 ;
            if($intervalStart == 1000 )    $diff = 1000 ;
            if($intervalStart == 10000 )    $diff = 10000 ;
            if($intervalStart == 100000 )    $diff = 10000 ;
            if($intervalStart == 1000000 )    $diff = 100000 ;
            if($intervalStart == 10000000 )    $diff = 10000000 ;
            if($intervalStart == 100000000 )    $diff = 100000000 ;
            if($intervalStart == 1000000000 )    $diff = 1000000000 ;
            if($intervalStart == 10000000000 )    $diff = 10000000000 ;
            if($intervalStart == 100000000000 )    $diff = 100000000000 ;
          //   if($intervalStart == 30000 )    $diff = 20000 ;
          //   if($intervalStart == 50000 )    $diff = 50000 ;
          //   if($intervalStart == 100000 )    $diff = 5000000000;
            $intervalStart = $intervalStart + $diff;

            if($intervalStart < $max)
              array_push($areaRange, $intervalStart );
            else
              $intervalStart = $max;
        }

        array_push($areaRange, round($intervalStart/10)*10 );
    }

    return $areaRange;
  }

  public static function getFilterName($modelClass, $filterSearchKey)
  {
    $filterObj = $modelClass::where('search_key', $filterSearchKey)->first();
    return $filterObj ? $filterObj->name : '';
  }

  public static function getFeaturesJoin($minMaxColumn, $searchKeys)
  {
    $propertyFeaturesMinMax = new PropertyFeatures;

    if ($minMaxColumn)
        $propertyFeaturesMinMax = $propertyFeaturesMinMax->selectRaw('MIN('. $minMaxColumn .') as min, MAX('. $minMaxColumn .') as max');

  return $propertyFeaturesMinMax->join('features', function($join) use($searchKeys){
                                              $join->on('property_features.feature_id', '=', 'features.id')
                                                  ->whereIn('search_key', $searchKeys);
                                          });
  }

  public static function getMinMaxLivingSqm()
  {
    $totalLivingSqm = self::getSizeMinMax('total_living_area');
    return self::calculateLivingAreaIntervals($totalLivingSqm->min, $totalLivingSqm->max);
  //   return self::calculatePriceDiff($totalLivingSqm->min, $totalLivingSqm->max);
  }

  public static function getSizeMinMax($column)
  {
    return Property::selectRaw('MIN(CASE
                                      WHEN '. $column .'_type  = "sq.ft."
                                      THEN ('. $column .' * 10.7639)
                                      ELSE '. $column
                                      .' END) AS min,
                              MAX(CASE
                                      WHEN '. $column .'_type  = "sq.ft."
                                      THEN ('. $column .' * 10.7639)
                                      ELSE '. $column
                                      .' END) AS max
                  ')->where($column, '!=', '0')->first();
  }

  public static function getSizeBetweenPropertyIds($properties, $min, $max, $column)
  {
    if (!empty($min) && empty($max))
      $str =  ">= ". $min;
    elseif (empty($min) && !empty($max))
      $str =  "<= ". $max;
    else
      $str =  "BETWEEN ". $min ." AND ". $max;

    return $properties->whereRaw('
                          ( ('. $column .'_type = "sq.ft."
                              and ('. $column .' * 10.7639) '. $str .')
                              OR ('. $column .'_type = "sq.m."
                              and '. $column .' '. $str
                          .') )'
                      );
  }

  public static function getFilterData($request)
  {
    $requestAll = (get_class($request) == 'stdClass') ? json_decode(json_encode($request), true): $request->all();
    $requestAll = array_filter($requestAll);

    $price = array_where($requestAll, function ($value, $key) { return strpos($key, 'price') > -1; });
    $size = array_where($requestAll, function ($value, $key) {
        return strpos($key, 'rooms') > -1 || strpos($key, 'living') > -1 || strpos($key, 'gardens') > -1;
    });

    $data['status'] = isset($request->status) ? ( is_array($request->status) ? $request->status : [$request->status] ) : [];
    $data['lat'] = isset($request->lat) ? $request->lat : '';
    $data['lng'] = isset($request->lng) ? $request->lng : '';
    $data['country'] = isset($request->country) ? $request->country : '';
    $data['country_code'] = isset($request->country_code) ? $request->country_code : '';
    $data['city'] = isset($request->city) ? $request->city : '';
    $data['address'] = isset($request->address) ? $request->address : '';
    $data['place'] = isset($request->place) ? $request->place : '';
    $data['price'] = $price;
    $data['type'] = isset($request->type) ? $request->type : [];
    $data['size'] = $size;
    $data['views'] = isset($request->views) ? $request->views : [];
    $data['proximities'] = isset($request->proximities) ? $request->proximities : [];
    $data['features'] = isset($request->features) ? $request->features : [];

    $data = array_filter($data);
    return $data;
  }

  public static function getIdsBySearchKey($model, $searchKeys)
  {
    return $model->whereIn('search_key', $searchKeys)->pluck('id');
  }

  public static function TypeFilterHtml($filtersData = null, $landingfolder = false, $folder = 'search', $cacheKey = false, $ajax = false)
  {
    // if (Cache::has($cacheKey)) {
    //     $data = Cache::get($cacheKey);
    // } else {
        $data['allTypes'] = PropertyTypes::getAllTypes();
        $data['typeData'] = isset($filtersData['type']) ? $filtersData['type'] : [];
    //     Cache::put($cacheKey, $data, 60 * 24 *30);
    // }

    return self::view($landingfolder, $folder, $ajax, 'type', $data);
  }

  public static function BuyRentFilterHtml($filtersData = null,$landingfolder = false, $folder = 'search',$cacheKey = false, $ajax = false)
  {

    // if (Cache::has($cacheKey)) {
    //     $data = Cache::get($cacheKey);
    // } else {

      $data['statuses'] = [
        'sale' => ['ForSale', 'flaticon-for-sale'],
        'rent' => ['ForRent', 'flaticon-house-with-a-signal-with-dollar-symbol'],
        'sold' => ['Sold', 'flaticon-sold'],
        'development' => ['NewDevelopment', 'flaticon-process']
      ];
      $data['statusData'] = isset($filtersData['status']) ? (is_array($filtersData['status']) ? $filtersData['status'] : [$filtersData['status']]) : [];

    //   Cache::put($cacheKey, $data, 60 * 24 *30);
    // }

    return self::view($landingfolder, $folder, $ajax, 'status', $data);
  }

  public static function PriceFilterHtml($filtersData = null, $landingfolder = false, $folder = 'search', $cacheKey = false, $ajax = false)
  {
    $data = [];

    // if (Cache::has($cacheKey)) {
    //     $data = Cache::get($cacheKey);
    // } else {
        $data['salePriceMinMaxValues'] = self::salePriceMinMaxValues();
        $data['monthlyFeeMinMaxValues'] = self::monthlyFeeMinMaxValues();
        $data['getMinPriceSqm'] = self::getMinPriceSqm();
        $data['currency'] = $filtersData['currency'];
        $data['priceData'] = isset($filtersData['price']) ? $filtersData['price'] : [];
        $data['cacheKey'] = $cacheKey;

    //     Cache::put($cacheKey,$data, 60 * 24 *30);
    // }

    return self::view($landingfolder, $folder, $ajax, 'price', $data);
  }

  public static function SizeFilterHtml($filtersData = null, $landingfolder = false, $folder = 'search', $cacheKey = false, $ajax = false)
  {
    // if (Cache::has($cacheKey)) {
    //     $data = Cache::get($cacheKey);
    // } else {
        $data['getMinMaxRooms'] = self::getMinMaxRooms();
        $data['livingSqm'] = self::getMinMaxLivingSqm();
        $data['getMinMaxGardenSqm'] = self::getMinMaxGardenSqm();
        $data['sizeData'] = isset($filtersData['size']) ? $filtersData['size'] : [];
    //     Cache::put($cacheKey,$data, 60 * 24 * 30);
    // }

    return self::view($landingfolder, $folder, $ajax, 'size', $data);
  }

  public static function AreaFilterHtml($filtersData = null, $landingfolder = false, $folder = 'search', $cacheKey = false, $ajax = false)
  {
    // if (Cache::has($cacheKey)) {
    //     $data = Cache::get($cacheKey);
    // } else {
        $data['livingSqm'] = self::getMinMaxLivingSqm();
        $data['getMinMaxGardenSqm'] = self::getMinMaxGardenSqm();
        $data['sizeData'] = isset($filtersData['size']) ? $filtersData['size'] : [];
    //     Cache::put($cacheKey,$data, 60 * 24 * 30);
    // }

    return self::view($landingfolder, $folder, $ajax, 'area', $data);
  }

  public static function ViewsFilterHtml($filtersData = null, $landingfolder = false, $folder = 'search', $cacheKey = false, $ajax = false)
  {
    // if (Cache::has($cacheKey)) {
    //     $data = Cache::get($cacheKey);
    // } else {
        $data['views'] = PrpView::orderBy('name')->get();
        $data['viewIcons'] = [
            'city_view' => 'flaticon-nature-1',
            'garden_view' => 'flaticon-plant',
            'sea_view' => 'flaticon-beach-1',
            'courtyard_view' => 'flaticon-buildings-2'
        ];
        $data['viewsData'] = isset($filtersData['views']) ? $filtersData['views'] : [];

    //     Cache::put($cacheKey,$data, 60 * 24 * 30);
    // }

    return self::view($landingfolder, $folder, $ajax, 'views', $data);
  }

  public static function ProximitiesFilterHtml($filtersData = null, $landingfolder = false, $folder = 'search', $cacheKey = false, $ajax = false)
  {
    // if (Cache::has($cacheKey)) {
    //     $data = Cache::get($cacheKey);
    // } else {
        $data['proximities'] =  Proximities::getAllProximities();
        $data['proximitiesData'] = isset($filtersData['proximities']) ? $filtersData['proximities'] : [];
    //     Cache::put($cacheKey,$data, 60 * 24 * 30);
    // }

    return self::view($landingfolder, $folder, $ajax, 'proximities', $data);
  }

  public static function FeaturesFilterHtml($filtersData = null, $landingfolder = false, $folder = 'search', $cacheKey = false, $ajax = false)
  {
    // if (Cache::has($cacheKey)) {
    //     $data = Cache::get($cacheKey);
    // } else {
        $data['features'] =  Features::getAllFeatures();
        $data['featuresData'] = isset($filtersData['features']) ? $filtersData['features'] : [];
    //     Cache::put($cacheKey,$data, 60 * 24 * 30);
    // }

    return self::view($landingfolder, $folder, $ajax, 'features', $data);
  }

  public static function getSelectedFilterString($request)
  {
    $typeFilterString = [];
    $statusesFilterString = [];
    $viewFilterString = [];
    $proximityFilterString = [];
    $featureFilterString = [];
    $str='';
    $siteLang = App::getLocale();

    if (!empty($request->country) && !empty($countryName = Country::find($request->country))){
        $str .= '<p>'.trans('common.Country').' : '.($request->country ? '<span>'. $countryName->{'name_'.$siteLang} .' <sup><a data-type="country" class="close-btn">&times;</a></sup> </span>' : '').'</p>';
    }
    $data['country'] = $str;
    $str = '';

    if (!empty($request->city)){
        $cityName = City::find($request->city);
        if($cityName)
          $str .= '<p>'.trans('common.City').'  : '.($request->city ? '<span>'. $cityName->{'name_'.$siteLang} .' <sup><a data-type="city" class="close-btn">&times;</a></sup> </span>' : '').'</p>';
    }
    $data['city'] = $str;
    $str = '';

    if (!empty($request->type)) {
        $types = PropertyTypes::whereIn('search_key', $request->type)->get();

        foreach ($types as $propType)
            $typeFilterString[] = '<span>'. trans('common.'. $propType->name) .' <sup><a data-type="type" class="close-btn" data-id="'. $propType->search_key .'">&times;</a></sup></span>';
    }
    $str = implode(' ', $typeFilterString);
    $data['type'] = ($str != '') ? '<p>'.trans('common.Type').'  : '. $str .'</p>' : '';

    if (!empty($request->status)) {
        $statuses = $request->status;

        foreach ($statuses as $status)
            $statusesFilterString[] = '<span>'. trans('common.'. $status) .' <sup><a data-type="status" class="close-btn" data-id="'. $status .'">&times;</a></sup></span>';
    }
    $str = implode(' ', $statusesFilterString);
    $data['statuses'] = ($str != '') ? '<p>'.trans('common.Status').'  : '. $str .'</p>' : '';


    if (!empty($request->map_view_property_id)) {
        $property = Property::find(base64_decode($request->map_view_property_id));
        $data['property'] = '<p> '.trans('common.Property').' : <span>'. $property->texts->subject_en .' </span></p>';
    }

    $str = '';

    if (!empty($request->min_price) || !empty($request->max_price))
        $str .= '<p>'.trans('common.Price').' : '.($request->min_price ? '<span> '.trans('common.Min').' - '. $request->min_price .' <sup><a data-type="min_price" class="close-btn">&times;</a></sup> </span>' : ''). ($request->max_price ? '<span> '.trans('common.Max').' - '.$request->max_price .' <sup><a data-type="max_price" class="close-btn">&times;</a></sup> </span>' : '').'</p>';

    if (!empty($request->monthly_min_price) || !empty($request->monthly_max_price))
        $str .= '<p>'.trans('common.MonthlyFee').' : '.($request->monthly_min_price ? '<span> '.trans('common.Min').' - '.$request->monthly_min_price .' <sup><a data-type="monthly_min_price" class="close-btn">&times;</a></sup> </span>' : ''). ($request->monthly_max_price ? '<span> '.trans('common.Max').' - '.$request->monthly_max_price .' <sup><a data-type="monthly_max_price" class="close-btn">&times;</a></sup> </span>' : '').'</p>';

    $data['price'] = $str;
    $str = '';


    if (!empty($request->rooms_min) || !empty($request->rooms_max))
        $str .= '<p>'.trans('common.Rooms').' : '.($request->rooms_min ? '<span> '.trans('common.Min').' - '.$request->rooms_min .' <sup><a data-type="rooms_min" data-id="room-min" class="close-btn">&times;</a></sup> </span>' : ''). ($request->rooms_max ? '<span> '.trans('common.Max').' - '.$request->rooms_max .' <sup><a data-type="rooms_max" data-id="room-max" class="close-btn">&times;</a></sup> </span>' : '').'</p>';

    if (!empty($request->living_min) || !empty($request->living_max))
        $str .= '<p>'.trans('common.LivingSqm').' : '.($request->living_min ? '<span> '.trans('common.Min').' - '.$request->living_min .' <sup><a data-type="living_min" data-id="living-min" class="close-btn">&times;</a></sup> </span>' : ''). ($request->living_max ? '<span> '.trans('common.Max').' - '.$request->living_max .' <sup><a data-type="living_max" data-id="living-max" class="close-btn">&times;</a></sup> </span>' : '').'</p>';

    if (!empty($request->gardens_min_sqm) || !empty($request->gardens_max_sqm))
        $str .= '<p>'.trans('common.GardenSqm').' : '.($request->gardens_min_sqm ? '<span> '.trans('common.Min').' - '.$request->gardens_min_sqm .' <sup><a data-type="gardens_min_sqm" data="gardens-min-sqm"class="close-btn">&times;</a></sup> </span>' : ''). ($request->gardens_max_sqm ? '<span> '.trans('common.Max').' - '.$request->gardens_max_sqm .' <sup><a data-type="gardens_max_sqm" data-id="gardens-max-sqm" class="close-btn">&times;</a></sup> </span>' : '').'</p>';

    $data['size'] = $str;

    if (!empty($request->views))
        foreach ($request->views as $viewId)
        {
            $viewText = self::getFilterName(PrpView::class, $viewId);
            $viewText = trans('viewproperty.' . str_replace(' ', '', $viewText));
            $viewText = str_replace(["\'", '\"'], "'", $viewText);
            $viewText = str_replace(["->'", '->"'], "", $viewText);
            $viewFilterString[] = '<span>'. $viewText . ' <sup><a data-type="views" class="close-btn" data-id="'. $viewId .'">&times;</a></sup></span>';
        }

    $str = implode(' ', $viewFilterString);
    $data['views'] = ($str != '') ? '<p>'.trans('common.Views').' : '. $str .'</p>' : '';

    if (!empty($request->proximities))
        foreach ($request->proximities as $proximityId)
        {
            $proximityText = self::getFilterName(Proximities::class, $proximityId);
            $proximityText = trans('common.'.str_replace(' ','',$proximityText));
            $proximityFilterString[] = '<span>'. $proximityText . ' <sup><a data-type="proximities" class="close-btn" data-id="'. $proximityId .'">&times;</a></sup></span>';
        }

    $str = implode(' ', $proximityFilterString);
    $data['proximities'] = $str != '' ? '<p>'.trans('common.Proximities').' : '. $str .'</p>' : '';

    if (!empty($request->features))
        foreach ($request->features as $featureId)
        {
            $featureText = self::getFilterName(Features::class, $featureId);
            $featureText  = trans('viewproperty.'.str_replace(' ','',$featureText));
            $featureText = str_replace(["\'",'\"'], "'",$featureText);
            $featureText = str_replace(["->'",'->"'], "",$featureText);
            $featureFilterString[] = '<span>'. $featureText . ' <sup><a data-type="features" class="close-btn" data-id="'. $featureId .'">&times;</a></sup></span>';
        }

    $str = implode(' ', $featureFilterString);
    $data['features'] = $str != '' ? '<p>'.trans('common.Features').' : '. $str .'</p>' : '';


    return (is_array($data) && count($data)) ? implode('', $data) : '';
  }

  public static function getCurrencyRates($currencyId = null)
  {
    $currencyRates = new CurrencyRates;

    if ($currencyId)
       $currencyRates = $currencyRates->where('convert_currency_id', $currencyId); // Default 10 for USD

    $currencyRates = $currencyRates->select('exchange_rate')
                                   ->where('base_currency_id', 1);

    return $currencyRates->where('currencies.exchangeable', '1')
                         ->join('currencies', 'currencies.id', '=', 'currency_rates.convert_currency_id')
                         ->first();
  }

  public static function getZoomLevelDistances($request)
  {
    if ($request->zoom == '8')
      $distances =  ['500','1000','2000'];
    elseif ($request->zoom == '9')
      $distances =  ['400','500','1000','1500'];
    elseif ($request->zoom == '10')
      $distances =  ['300','400','500','1000','1500'];
    elseif ($request->zoom == '11')
      $distances =  ['200','400','500','1000','1500'];
    elseif ($request->zoom >= 12)
      $distances =  ['150','200','300','400','500','1000','1500','2000'];
    else
      $distances =  ['500','1000','1500','2000','3000','4000','5000','6000','10000'];

    return $distances;
  }

  public static function view($landingfolder, $folder, $ajax, $page, $data)
  {
    $view = 'front.search.filters'.($landingfolder ? ('.'.$landingfolder) : ($folder ? '.'.$folder : '')) . ($ajax ? '.ajax' : '') .'.'.$page;

    if($ajax)
      return (string) view($view, $data);
    else
      return view($view);
  }
}
