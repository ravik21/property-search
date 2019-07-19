<?php

namespace App\Helpers;
use App\Http\Controllers\Controller;
use App\Models\PropertyStatistics;
use App\Models\Language;
use App\Models\Property;
use App\Models\UserView;
use App\Models\Country;
use App\Models\State;
use App\Models\City;
use App\Models\Currency;
use App\Models\PropertyTexts;
use App\Models\PropertyTranslation;
use App\Models\CountryDomain;
use App\Models\Article;
use Auth, Carbon\Carbon;
use Session, Response, Config, App;
use Exception, Cache;

define('WITHOUT_ZIP_CODE', false);

class CommonHelper extends Controller
{
    public static $total = 0;

    public static function storePropertyStatistics($propertyId, $type)
    {
        $data = [];
        Session::put('last_property_viewed',$propertyId);

        $data['property_id'] = $propertyId;
        $data['type']        = $type;
        $data['user_id']     = Auth::check() ? Auth::id() : null;
        $data['created_at']  = Carbon::now();
        $data['updated_at']  = Carbon::now();

        self::storePropertyUserView($propertyId,'property');


        // $ipInfo = self::getIpInfo();
        // if(!empty($ipInfo) && $ipInfo->ip)
        // {
        //   $data['ip'] = $ipInfo->ip;
        //   $data['geo_city'] = $ipInfo->city;
        //   $data['geo_country'] = $ipInfo->country_name;
        //   $data['geo_region'] = $ipInfo->region_name;
        // }

        PropertyStatistics::insert($data);

        return 'success';
    }

    public static function storePropertyUserView($id,$type)
    {
      $data = [];
      if($type == 'property')
        $property = Property::where('id', $id)->first();

      $data['reference_id'] = isset($property) && $property ? $property->agency->user->id : $id;
      $data['user_id']      = Auth::check() ? Auth::id() : null;
      $data['contact_to']   = 'agent';
      $data['ip_address']   = CommonHelper::get_ip();
      $data['created_at']   = Carbon::now();
      $data['updated_at']   = Carbon::now();

      UserView::insert($data);

      return 'success';
    }

    public static function _storePropertyStatistics($property, $type)
    {
        $selectedProperty = [
            'id' => $property->id,
            'price' => $property->originalPrice(),
            'subject' => $property->texts->langSubject(),
            'address' => $property->langAddress(),
            'main_image'=> $property->main_image_url,
            'preview_image' => ($property->propertyPreviewImages)? $property->propertyPreviewImages->s3_url : ''
        ];


        return $selectedProperty;

        Session::put('last_property_viewed',$selectedProperty);

        $ipInfo = self::getIpInfo();
        if(empty($ipInfo)) return 'fail';

        $propertyId = $property->id;
        $now = Carbon::now();
        $startOfDay = $now->copy()->startOfDay();

        $checkPreviousStats = PropertyStatistics::where([
                                                  'property_id' => $propertyId,
                                                  'ip' => $ipInfo->ip,
                                                  'type' => $type
                                                ])
                                                ->whereBetween('created_at', [ $startOfDay, $now ]);

        $userId = Auth::check() ? Auth::id() : NULL;
        $lastPropertyId = PropertyStatistics::where('user_id', $userId);
        $lastPropertyId = $lastPropertyId->orderBy('id', 'desc')->pluck('property_id')->first();

        if($lastPropertyId == $propertyId) return $selectedProperty;

        if (!empty($checkPreviousStats))
            $checkPreviousStats->where('user_id', $userId)->delete();

        $propertyStatistics = new PropertyStatistics;
        $propertyStatistics->property_id = $propertyId;
        $propertyStatistics->user_id = Auth::check() ? Auth::id() : null;
        $propertyStatistics->ip = $ipInfo->ip;
        $propertyStatistics->geo_city = $ipInfo->city;
        $propertyStatistics->geo_country = $ipInfo->country_name;
        $propertyStatistics->geo_region = $ipInfo->region_name;
        $propertyStatistics->type = $type;
        $propertyStatistics->save();

        return $selectedProperty;
   }

  public static function getRecentProperties($limit)
  {
      $ipInfo = self::getIpInfo();
      $selectedProperty = Property::mainImagePropertiesFilter()
            ->select(
               'property.id','property.main_image_url','property.price_on_request','property_statistics.id as prop_stat_id','property.price',
               'property.rent','property.preview_mode','property.geo_lat','property.geo_lng','property.country_id','property.agency_id',
               'property_statistics.ip', 'property_statistics.type','property_statistics.user_id'
              )
              ->join('property_statistics','property.id','property_statistics.property_id');

      if(!empty($ipInfo))
      {
          $selectedProperty = $selectedProperty->where([
                                                'property_statistics.ip' => $ipInfo->ip,
                                                'property_statistics.type' => 1
                                              ]);
      }

      if(Auth::check())
          $selectedProperty = $selectedProperty->where('property_statistics.user_id',Auth::id());
      if(\Request::segment(9))
      {
          $params = explode( '-', \Request::segment(9) );
          $id = end( $params );
          $selectedProperty = $selectedProperty->where('property.id','!=',$id);
      }

    if (!empty(SITE_COUNTRY))
        $selectedProperty = $selectedProperty->where('property.country_id',SITE_COUNTRY);

    return $selectedProperty;
  }

  public static function getIpInfo($ip = null)
  {
    return [];

      if (is_null($ip))
          $ip = self::get_ip();

      try {
          return json_decode(self::file_get_contents_curl("https://freegeoip.net/json/" . $ip));
      } catch(Exception $e) {
          \Log::error($e);
      }

      return false;
  }

    public static function getAppCurrency($withSymbol = true, $returnCurrencyObj = false)
    {
        $appLang = App::getLocale() ? App::getLocale() : 'en';
        $name = 'language_currency_'. (Session::has('currency') ? Session::get('currency') : $appLang);

        // if (Cache::has($name)) {
        //     $lang = Cache::get($name);
        // } else {
          $lang = Currency::find(Session::get('currency'));
        //   Cache::put($name, $lang, 60*24*30);
        // }

        if (empty($lang)) {
            $lang = Language::select('currencies.id', 'currencies.currency', 'currencies.symbol')
                ->join('currencies', 'languages.currency_id', '=', 'currencies.id')
                ->where('country_code', $appLang)
                ->first();
        }

        if (empty($lang)) {
            $lang = Language::select('currencies.id', 'currencies.currency', 'currencies.symbol')
                ->join('currencies', 'languages.currency_id', '=', 'currencies.id')
                ->where('country_code', 'en')
                ->first();
        }

        Session::put('currency', $lang->id );

        return $returnCurrencyObj ? $lang : ( ($withSymbol ? $lang->symbol.' ' : ''). $lang->currency );
    }

    public static function get_ip() {

        if(\App::runningInConsole())
            return '';

        $the_ip = '';
        //Just get the headers if we can or else use the SERVER global
        if ( function_exists( 'apache_request_headers' ) )
          $headers = apache_request_headers();
        else
          $headers = $_SERVER;

        //Get the forwarded IP if it exists
        if ( array_key_exists( 'X-Forwarded-For', $headers ) && filter_var( $headers['X-Forwarded-For'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 ) )
		{
          $the_ip = $headers['X-Forwarded-For'];
		}
        elseif ( array_key_exists( 'HTTP_X_FORWARDED_FOR', $headers ) && filter_var( $headers['HTTP_X_FORWARDED_FOR'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 ))
		{
          $the_ip = trim($headers['HTTP_X_FORWARDED_FOR']);
		}
        elseif ( array_key_exists( 'HTTP_X_FORWARDED_FOR', $headers ) )
		{
			$the_ip = trim($headers['HTTP_X_FORWARDED_FOR']);
			if (strpos($the_ip,",")) // On Amazon Cloudfront + ELB makes the IP returned like this "81.231.167.18, 205.251.218.70" , that is why we need this code
			{
			  $iplist = explode(",",$the_ip);
			  $the_ip = trim($iplist[0]);
			}
		}
        else
        $the_ip = filter_var( $_SERVER['REMOTE_ADDR'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 );

		if (strpos($the_ip,"72.31.")) // if we have this ip.. then something is wrong..
		{
			if (isset($_SERVER['HTTP_X_FORWARDED_FOR']))
			{
				$the_ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
				if (strpos($the_ip,",")) // On Amazon Cloudfront + ELB makes the IP returned like this "81.231.167.18, 205.251.218.70" , that is why we need this code
				{
				  $iplist = explode(",",$the_ip);
				  $the_ip = trim($iplist[0]);
				}
			}
		}

        return $the_ip;
    }

  public static function cleanString($string)
  {
      $utf8 = array(
        '/[áàâãªä]/u'   =>   'a',
        '/[ÁÀÂÃÄ]/u'    =>   'A',
        '/[ÍÌÎÏ]/u'     =>   'I',
        '/[íìîï]/u'     =>   'i',
        '/[éèêë]/u'     =>   'e',
        '/[ÉÈÊË]/u'     =>   'E',
        '/[óòôõºö]/u'   =>   'o',
        '/[ÓÒÔÕÖ]/u'    =>   'O',
        '/[úùûü]/u'     =>   'u',
        '/[ÚÙÛÜ]/u'     =>   'U',
        '/ç/'           =>   'c',
        '/Ç/'           =>   'C',
        '/ñ/'           =>   'n',
        '/Ñ/'           =>   'N',
        '/–/'           =>   '-', // UTF-8 hyphen to "normal" hyphen
        '/[’‘‹›‚]/u'    =>   ' ', // Literally a single quote
        '/[“”«»„]/u'    =>   ' ', // Double quote
        '/ /'           =>   ' ', // nonbreaking space (equiv. to 0x160)
      );

      $string = preg_replace(array_keys($utf8), array_values($utf8), $string);
      $string = preg_replace('/\s/', ' ', $string);
      $string = str_replace(' - ','-',$string);
      $string = str_replace(["\'",'\"',"->'",'->"','%',',','.','#','%'], "",$string);
      $string = str_replace([' ', '/', "'",','], '-', strtolower($string));
      return str_replace(['--'], '-', $string);
  }


 public static function propertyDetailPageURL($property, $locale)
 {
     $lang = App::getLocale();
     if(!$lang || !in_array($locale , self::translatable())) $lang = $locale;

     $type = (isset($property->type_name) && $property->type_name) ? self::cleanString(trans('common.'. $property->type_name)) : trans('seolinks.unknown');

     $country = Country::select('search_key')->where('id' , $property->country_id ? : NULL)->first();
     $state   = State::select('search_key')->where('id' , $property->state_id ? : NULL)->first();
     $city    = City::select('search_key')->where('id' , $property->city_id ? : NULL)->first();

     $city    = $city ? self::cleanString(trans('cities.' . $city->search_key)) : trans('common.city');
     $state   = $state ? self::cleanString(trans('states.' . $state->search_key)) : trans('common.states');
     $country = $country ? self::cleanString(trans('countries.' . $country->search_key)) : trans('common.country');

     $agencyName = isset($property->agency_name) && $property->agency_name ? self::cleanString($property->agency_name) : trans('seolinks.unknown');
     $propertyId = isset($property->property_id) ? $property->property_id : $property->id;

     $propertySubject = '';

    $propertySubject = PropertyTranslation::select('subject')->where('property_id', $property->id)->first()->subject ?? PropertyTranslation::defaultSubject();

    if (!$propertySubject)
            $propertySubject = $type.'-'.$agencyName.'-'.$country;

     $propertySubject = self::cleanString($propertySubject);
     $propertySubject = self::cleanString($propertySubject) .'-'. $propertyId;

    $propertyUrlContent = [
        $lang, strtolower(trans('common.'. ($property->status != '' ? $property->status : ($property->sale_status ? $property->sale_status : ($property->rental_status ? $property->rental_status : 'buy' ))))), trans('seolinks.property'), $type,
        $country, $state, $city, $agencyName, $propertySubject
    ];

    $finalUrl = '/'. implode('/', $propertyUrlContent);

    return $finalUrl;
 }

 public static function propertyLangAddress($property, $locale = false)
 {
     $address = '';

     $lang = $locale ? $locale : App::getLocale();
     $type = (isset($property->type_name) && $property->type_name) ? self::cleanString(trans('common.'. $property->type_name)) : trans('seolinks.unknown');

     $country = Country::select('search_key')->where('id' , $property->country_id ? : NULL)->first();
     $state   = State::select('search_key')->where('id' , $property->state_id ? : NULL)->first();
     $city    = City::select('search_key')->where('id' , $property->city_id ? : NULL)->first();

     if ($property->street_address && $property->hide_street_address)
        $address .= $property->street_address. ', ';

    if ($city && $city->search_key)
         $address .= trans('cities.' . $city->search_key) . ', ';
    elseif($property->city)
        $address .= $property->city . ', ';

    if ($state && $state->search_key)
        $address .= trans('states.' . $state->search_key) . ', ';

    if ($country && $country->search_key)
        $address .= trans('countries.' . $country->search_key) . ' ';

    return self::filterString($address);
 }

 public static function filterString($string)
 {

     $string = str_replace(["\'", '\"'], "'", $string);
     $string = str_replace(["<p><br></p>"], "", $string);
     $string = str_replace(["->'", '->"'], "", $string);
     $string =  str_replace(["\r\n", "\r", "\n"], "<br/>", $string);

     return $string;
 }

 public static function propertyHistory()
 {
     return Property::join('property_statistics', function($join){
                            $join->on('property_statistics.property_id','=','property.id')
                                 ->where('property_statistics.user_id', Auth::id());
                             })->take(10)->orderBy('property_statistics.id','desc')->get();
 }


 public static function checkFiltersExist($request)
 {
     $price = array_where($request->all(), function ($value, $key) {
         return strpos($key, 'price') > -1;
     });

     $size = array_where($request->all(), function ($value, $key) {
         return strpos($key, 'rooms') > -1 || strpos($key, 'living') > -1 || strpos($key, 'gardens') > -1;
     });

     return $request->has('type') || $request->has('status') ||count($price) || count($size) || $request->has('size') || $request->has('proximities') || $request->has('features') || $request->has('views');
 }

    public static function translateLocality($locality,$locality_type)
    {

        $translatable = Language::$translatable;

        $apiKey = 'AIzaSyAEQXMgADE7welF--5HpLi4_r_UCzGtc4E';

        $source = '';
        $text = '';

        $field = 'name';

        foreach ($translatable as $key => $translatableLang) {
          if($locality->{$field.'_'.$translatableLang} != '' || $locality->{$field.'_'.$translatableLang} != null)
          {
             $text = $locality->{$field.'_'.$translatableLang};
             $source = $translatableLang;
             break;
          }
        }

        if($source && $text){
          foreach ($translatable as $key => $translatableLang) {

              if($locality->{$field.'_'.$translatableLang} == '' || $locality->{$field.'_'.$translatableLang} == null)
              {
                  $translateParmsWithExe = Language::translateParmsWithExe(['source'=>$source,'target'=>$translatableLang]);
                  $source = $translateParmsWithExe['source'];
                  $target = $translateParmsWithExe['target'];

                  $url = 'https://translation.googleapis.com/language/translate/v2';
                  $params = '?key=' . $apiKey . '&q=' . urlencode($text) . '&target=' . trim($target) . '&source=' . trim($source);

                  try {
                      $response = @file_get_contents($url . $params);

                      if($response === FALSE) {
                        $translatedText = null;
                      }
                      else{
                        $result = json_decode($response, true);
                        if (isset($result['error']) && !empty($result['error'])) {
                            $translatedText = null ;
                        } else {
                            $translatedText = $result['data']['translations'][0]['translatedText'];
                        }
                      }

                      $locality->{ $field.'_'.$translatableLang } = $translatedText;
                      echo 'Locality Type : '.ucfirst($locality_type). ' Column : ' .$field.'_'.$translatableLang .' Text : ' . $translatedText .PHP_EOL;

                  } catch (\Exception $e) {

                  }

              }

          }

        }


        return $locality;
    }

    // public static function getValidationTrans($col, $attr, $val)
    // {
    //     $msg = trans('validation.' . $col);
    //     $msg = str_replace(':attribute', $attr, $msg['string']);
    //     return str_replace(':' . $col, $val, $msg);
    // }

    public static function getValidationTrans($col, $attr, $val)
    {
       return 'The credentials does not match to our required criteria';
       $msg = trans('validation.' . $col);
       $msg = str_replace(':attribute', $attr, $msg['string']);
       return str_replace(':' . $col, $val, $msg);
    }

    public static function is_url_exist($url){
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if($code == 200){
           $status = true;
        }else{
          $status = false;
        }
        curl_close($ch);

       return $status;
    }

    public static function getCountryCurrency($country_id){
      $country = Country::find($country_id);
      if($country) return $country->currency;
    }

    public static function getDomains()
    {
      $domains = CountryDomain::select('country_domains.name as domain','countries.name_en','languages.country_code as lang','countries.geo_lat','countries.geo_lng','countries.iso','countries.search_key')
                                         ->join('countries','country_domains.country_id','countries.id')
                                         ->join('languages','countries.language_id','languages.id')
                                         ->orderby('countries.name_en','asc')
                                         ->whereNotIn('country_domains.name',['.co.th','.es']);
      return $domains;
    }

    public static function newPosts($limit, $lang = 2)
    {
      $articles = Article::withCountry();
      $articles = $articles->where('article_texts.lang_id', $lang)->take($limit)->get();

      return $articles;
    }

    public static function quickLinks($locale)
    {
        $selectRaw = 'property.status, property.geo_lat, property.geo_lng, property_types.search_key, property_types.search_key as type,property.property_type_id , countries.name_'.$locale.' as country, countries.id as country_id';

        if(!empty(SITE_COUNTRY))
            $selectRaw .= ',cities.id as city_id, cities.name_'.$locale.' as city';

        $links = Property::selectRaw($selectRaw)
                        ->join('property_types', 'property.property_type_id', 'property_types.id')
                        ->join('countries','property.country_id','countries.id');

        if(!empty(SITE_COUNTRY))
            $links = $links->leftJoin('cities','property.city_id','cities.id')->where('countries.id', SITE_COUNTRY);


        $links = $links->groupBy(!empty(SITE_COUNTRY) ? 'property.city_id' : 'property.country_id');

        $types = clone $links->pluck('type','property_type_id');

        $linksGroupBYTags =  collect(array_flip($types->toArray()))->map(function($id,$type)use($links){
              $typeLinks = clone $links;
              $typeLinks = $typeLinks->where('property.property_type_id',$id)->orderBy('type','asc')
                            ->inRandomOrder();

             if(empty(SITE_COUNTRY))
                 $typeLinks = $typeLinks->take(100);

              $typeLinks = $typeLinks->get();


             return $typeLinks;
        });


        return $linksGroupBYTags;
    }

    public static function translatable()
    {
        return ['en', 'bn', 'ro', 'fr', 'ar', 'de', 'no', 'es', 'es_mx', 'ma', 'sv', 'da', 'fi', 'pt', 'ru', 'ja', 'it', 'uk', 'hi', 'fil', 'th','ka'];
    }
    public static function getProperty($propertyId)
    {
      $text ="";
      if($propertyId){
        $text = PropertyTranslation::select('subject','description')
                ->join('property','property_translations.property_id','property.id')
                ->where('property_translations.property_id', $propertyId)
                ->first();
      }
      return $text;
    }

}
