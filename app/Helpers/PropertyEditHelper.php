<?php

namespace App\Helpers;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Auth\RegisterController;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

use App\Models\PropertyTexts;
use App\Models\PropertyTranslation;
use App\Models\Language;
use App\Models\Property;
use App\Models\PropertyFeatures;
use App\Models\PropertyView;
use App\Models\PropertyProximities;
use App\Models\PropertyImages;
use App\Models\PropertyTypes;
use App\Models\City;

use Auth, Carbon\Carbon, Session, Redirect, App, Cache;


class PropertyEditHelper extends Controller
{

    public static function updateBasicInfo($request)
    {
        $user = Auth::user();

        $validate = validator($request->all(), [
          'type'   =>  'required|exists:property_types,id',
          'lang'   =>  'required|exists:languages,country_code,has_lang,1'
        ]);

        if ($validate->fails())
            return back()->withErrors($validate)->withInput();

        $property = Property::firstOrNew(['id' => $request->property_id]);

        if ($user->role_id == '4')
            $property->agency_id = $user->agency_id;

        if ($user->role_id == '3')
        {
            $property->agent_id = $user->id;

            if ($user->agency)
                $property->agency_id = $user->agency->id;
            else
                return back();
        }

        if ($user->role_id == '2')
        {
           $user = $user->toArray();
           $controller = new RegisterController;
           $user = $controller->createAgency($user);
           $property->agent_id = $user->id;

           if ($user->agency) $property->agency_id = $user->agency->id;
        }

        $property->property_type_id = $request->type;
        $property->status       = $request->status;
        $property->preview_mode = $request->preview_mode ? $request->preview_mode : 1;

        if( $request->has('status') && $request->status == 'sale') $property->sale_status = $request->status;
        if( $request->has('status') && $request->status == 'rent') $property->rental_status = $request->status;
        if( $request->has('status') && $request->status == 'sold') $property->mark_as_sold = 1;
        if( $request->has('status') && $request->status == 'development') $property->development = 1;
        $property->save();

        if($request->title || $request->description){
          $language = Language::where('google_translate_code', $request->lang)->first();

          $propertyTranslation = PropertyTranslation::firstOrNew(['property_id' => $property->id]);
          $propertyTranslation->locale = $request->lang;
          $propertyTranslation->subject = $request->title;
          $propertyTranslation->description = $request->description;
          $propertyTranslation->language_id = $language->id;
          $propertyTranslation->save();
        }



        if (empty($propertyId) && env('APP_ENV') == 'production') {
            \Session::push('google_analytics_event', [
                'category' => ($user->role_id == 3 ? 'Agent' : 'Agency'),
                'action'   => 'Property Added',
                'label'    => ($user->role_id == 3 ? 'Agent' : 'Agency') . ' Property Added',
                'value'    => ($user->role_id == 3 ? $user->id : $user->agency->id)
            ]);
        }

        $nextPage = 'location';
        if($request->section){
          $nextPage = str_replace("-", "_", $request->section);
        }

        $return = '/'.$request->lang .'/property/'. $property->id .'/edit/'.$nextPage;
        $message = trans('common.PropertyAddedMessage');
        if(!$request->wantsJson())
          return redirect($return);
        else
          return response()->json(['message' => $message,'link' => $return],200);
    }

    public static function updateLocation(Request $request)
    {
        $validate = validator($request->all(), [
            'property_id' => 'required|exists:property,id',
            'latitude'    => 'numeric',
            'longitude'   => 'numeric',
            'zip_code'    => 'required|min:4|max:10|regex:/^[ A-Z0-9]+$/',
            'country'     => 'required|exists:countries,id',
        ]);

        if ($validate->fails()) {
            return back()->withErrors($validate)->withInput();
        }

        $property = Property::find($request->property_id);

        if ($request->country) {
            $property->country_id = $request->country;
        }

        if ($property->zip_code != $request->zip_code) {
            $property->zip_code = $request->zip_code;
        }

        if ($property->street_address != $request->street_address) {
            $property->street_address = $request->street_address;
        }

        $property->hide_street_address = $request->hide_street_address ?: null;

        $cityId = City::findCityByName($request->city, $request->country);
        $property->city_id = $cityId ?: null;
        $property->city = $request->city;

        if ($request->latitude) {
            $property->geo_lat = $request->latitude;
        }

        if ($request->longitude) {
            $property->geo_lng = $request->longitude;
        }

        $property->save();

        $nextPage = 'pricing_measurement';

        return redirect(SITE_LANG .'/property/'. $request->property_id .'/edit/'. $nextPage);
    }

    public static function updatePricingMeasurement(Request $request)
    {
        $rules = [
            'property_id'        => 'required|exists:property,id',
            'total_living_area'  => 'numeric',
            'total_garden_area'  => 'numeric',
            'price'              => 'numeric',
            'rent'               => 'numeric',
            'monthly_fee'        => 'numeric',
            'rental_monthly_fee' => 'numeric',
            'rental_duration'    => 'numeric',
            'rooms'              => 'numeric',
        ];

        $validate = validator($request->all(), $rules);

        if ($validate->fails())
            return back()->withErrors($validate)->withInput();

        $property = Property::find($request->property_id);

        $currency = App\Helpers\CommonHelper::getAppCurrency(false, true);

        if(isset($request->status) && is_array($request->status) && count($request->status))
        {
            if(in_array('sale', $request->status) )
            {

                $property->sale_status = 'sale';

                if(!isset($request->price_on_request))
                {
                    if($request->price)
                    {
                        $property->price_currency = $currency->symbol;
                        $property->price_currency_id = $currency->id;
                        $property->price = $request->price;
                    }

                    if($request->monthly_fee)
                    {
                        $property->monthly_fee_currency = $currency->symbol;
                        $property->monthly_fee_currency_id = $currency->id;
                        $property->monthly_fee = $request->monthly_fee;
                    }
                }


            }

            if(!in_array('sale', $request->status) )
            {
                $property->sale_status = '';
                if(!isset($request->price_on_request))
                {
                    if($request->price)
                    {
                        $property->price ='';
                    }

                    if($request->monthly_fee)
                    {
                        $property->monthly_fee = '';
                    }
                }


            }

            if(in_array('rent', $request->status))
            {
                $property->rental_status = 'rent';

                if(!isset($request->price_on_request))
                {

                    if($request->rent)
                    {
                        $property->rental_currency = $currency->symbol;
                        $property->rental_currency_id = $currency->id;
                        $property->rent = $request->rent;
                        $property->rental_duration = $request->rental_duration;

                    }

                    if($request->rental_monthly_fee)
                    {
                        $property->monthly_fee_currency = $currency->symbol;
                        $property->monthly_fee_currency_id = $currency->id;
                        $property->rental_monthly_fee = $request->rental_monthly_fee;
                    }
                }
            }

            if(!in_array('rent', $request->status))
            {
                $property->rental_status = '';

                if(!isset($request->price_on_request))
                {

                    if($request->rent)
                    {
                        $property->rent = '';
                        $property->rental_duration = '';

                    }

                    if($request->rental_monthly_fee)
                    {
                        $property->rental_monthly_fee = '';
                    }
                }
            }

            if (in_array('sold', $request->status))
            {
                $property->mark_as_sold = 1;
                $property->sold_price_currency_id = $currency->id;
                $property->sold_price = $request->sold_price;
                $property->price ='';
                $property->monthly_fee = '';
                $property->rent = '';
                $property->rental_duration = '';
                $property->rental_monthly_fee = '';
                $property->sale_status = '';
                $property->rental_status = '';

            } else {
                $property->mark_as_sold = 0;
                $property->sold_price = '';
            }

            if (in_array('development', $request->status))
            {
                $property->development = 1;
                $property->build_year = $request->build_year;
                $property->mark_as_sold = 0;
            }

        }

        $property->price_on_request = isset($request->price_on_request) ? 1 : 0;

        $areaFields = [
            'rooms' => 'rooms', 'total_living_area_type' => 'total_living_area',
            'total_garden_area_type' => 'total_garden_area'
        ];

        foreach ($areaFields as $key => $field) {
            $property->$field = $request->$field;
            $property->$key = $request->$key;
        }


        $property->save();

        $nextPage = 'features';

        return redirect(SITE_LANG .'/property/'. $request->property_id .'/edit/'. $nextPage);

    }

    public static function updateFeatures(Request $request)
    {
        $validate = validator($request->all(), [
            'property_id' => 'required|exists:property,id',
            'features'    => 'required|array',
            'features.*'  => 'exists:features,id',
        ]);

        if ($validate->fails()) {
            return back()->withErrors($validate)->withInput();
        }

        PropertyFeatures::where('property_id', $request->property_id)
            ->whereNotIn('feature_id', $request->features)
            ->delete();

        foreach ($request->features as $featureId => $feature) {
            PropertyFeatures::firstOrCreate([
                'property_id' => $request->property_id,
                'feature_id'  => $feature
            ]);
        }

        $property = Property::find($request->property_id);
        $nextPage = 'views';

        return redirect(SITE_LANG .'/property/'. $request->property_id .'/edit/'. $nextPage);
    }

    public static function updateViews(Request $request)
    {
        $validate = validator($request->all(), [
            'property_id' => 'required|exists:property,id',
            'views'       => 'required|array',
            'views.*'     => 'exists:views,id',
        ]);

        if ($validate->fails()) {
            return back()->withErrors($validate)->withInput();
        }

        PropertyView::where('property_id', $request->property_id)
            ->whereNotIn('view_id', $request->views)
            ->delete();

        foreach ($request->views as $view) {
            PropertyView::firstOrCreate([
                'property_id' => $request->property_id,
                'view_id'     => $view
            ]);
        }
        $property = Property::find($request->property_id);
        $nextPage = 'proximity';

        return redirect(SITE_LANG .'/property/'. $request->property_id .'/edit/'. $nextPage);
    }

    public static function updateProximity(Request $request)
    {
        $validate = validator($request->all(), [
            'property_id'   => 'required|exists:property,id',
            'proximities'   => 'required|array',
            'proximities.*' => 'exists:proximities,id',
        ]);

        if ($validate->fails()) {
            return back()->withErrors($validate)->withInput();
        }

        PropertyProximities::where('property_id', $request->property_id)
            ->whereNotIn('proximity_id', $request->proximities)
            ->delete();

        foreach ($request->proximities as $proximity) {
            PropertyProximities::firstOrCreate([
                'property_id'   => $request->property_id,
                'proximity_id'  => $proximity
            ]);
        }
        $property = Property::find($request->property_id);
        $nextPage = 'gallery';

        return redirect(SITE_LANG .'/property/'. $request->property_id .'/edit/'. $nextPage);
    }

    public static function updateGallery(Request $request)
    {
        $validate = validator($request->all(), [
            'property_id' => 'required|exists:property,id',
            'file'        => 'required|file|image'
        ]);

        $property = Property::find($request->property_id);
        if($request->has('file'))
        {
          $image = $request->file('file');
          $agency = $property->agency()->first();

          if ($agency) {
            $s3_path = str_replace('\'', '-', str_replace(' ', '-', strtolower($agency->public_name))) . '/';
          } else {
            $s3_path = 'property/';
          }

          $s3_path .= $property->id . '/';

          $s3_path .= md5(time() . microtime()) . '.' . $image->getClientOriginalName();

          $propertyImage = new PropertyImages;
          $propertyImage->property_id = $request->property_id;

          $ctrl = new Controller;
          $s3Url = $ctrl->uploadFileToS3($image, $s3_path);
          $propertyImage->s3_url = $s3Url;

          if (empty($property->main_image_url)) {
            $property->main_image_url = $s3Url;
            $property->save();
            $propertyImage->main_image = 1;
          }

          $propertyImage->s3_path = $s3Url;
          $propertyImage->save();

          $return['image'] = $propertyImage;
          $return['trans_SetMainImage'] = trans('common.SetMainImage');

          return $return;
        }

        return redirect(SITE_LANG .'/property/'. $request->property_id .'/edit/choose_agent');


    }

    public static function updateChooseAgent(Request $request)
    {
        $validate = validator($request->all(), [
            'property_id' => 'required|exists:property,id',
            'agent'       => 'exists:users,id',
        ]);

        if ($validate->fails()) {
            return back()->withErrors($validate)->withInput();
        }

        $property = Property::find($request->property_id);

        $property->agent_id = ($request->agent) ? $request->agent : null;
        $property->save();

        return redirect(SITE_LANG .'/property/'. $request->property_id .'/edit/choose_agent');
    }

}
