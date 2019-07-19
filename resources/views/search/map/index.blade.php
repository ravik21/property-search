@extends('layouts.front')
@section('title', trans('common.BuySellRentProperty') )
@section('content')
      <section class="searchResultSection noPadding">
        <div class="filterSearch mapInput hidden-xs input-group">
          <span id="page-content" class="hidden" data-page-view='map'></span>
          <input type="text"  class="search-address form-control" placeholder="{{trans('common.SearchAddress')}}" value="{{isset($request['address']) ? $request['address'] : ''}}" data-name="{{ trans('common.Location') }}">
          <label><i class="fa fa-search zoom-search-property"></i><i class="fa fa-times zoom-map-property" onclick="clearAutocompleteField()"></i></label>
        </div>
        <div class="resultSection @if(!IS_MOBILE) moreMapArea @endif">
        <div class="mapCol" data-lat="{{isset($request['lat']) ? $request['lat'] : '' }}" data-lng="{{ isset($request['lng']) ? $request['lng'] : ''   }}" data-zoom="{{isset($request['zoom']) ? $request['zoom'] : 8}}">
            <div id="map" width="100%"></div>
            <div class="mapListBtn" id="property-view" data-page-number="1" data-ajax-request="0">
                <a href="javascript:void(0)" onclick="toggleListArea(event)" class="mListBtn">
                  <i class="fa fa-angle-left"></i> {{ $request['mobileDetect'] ? trans('common.SwipeLeft') : trans('common.MoreList') }}
                </a>
                <a href="javascript:void(0)" onclick="toggleListArea(event)" class="mMapBtn">
                  {{trans('common.MoreMap')}} <i class="fa fa-angle-right"></i>
                </a>
            </div>
        </div>

        <div class="searchListCol" onscroll="searchMapScrollRequest(event)">
          <div class="property-loader" ><div><span> <img data-src="/assets/img/loader_1.gif"> <span>{{trans('common.UpdatingResults')}}</span></span></div></div>
          <div class="searchListTopSection">
                <h2><div id="properties_title" style="display:inline">{{trans('common.RealEstate')}}</div></h2>
                @include('includes.sorting')
            </div>
            <div id="prop-mCustomScrollbar">
                <div class="propResultList">
                    <ul id="search-prop-list"></ul>
                    <div class="searchListing saveThisSearch">
                      <img data-src="/assets/img/search7.gif" data-searching="/assets/img/search7.gif" data-no-result="/assets/img/no-search-result.png" id="no_result_img">
                      <h3>
                        <a href="javascript:void(0)" class="share-btn" onclick="generateShareLink(event)" data-href="{{$appUrl .SITE_LANG . '/s/'}}">{{trans('common.SaveThisSearch')}}</a> {{trans('common.SaveThisSearchText')}}</h3>
                        <div class="tooltiptext"><stong>{{trans('common.SavedCopied')}}</strong></div>
                        <div class="result-title no-padding" id="show-loc"></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- End Properties List Section -->

    </div>
</section>

@endsection

@section('extra_scripts')
<script>
    _jsFiles.push('/assets/js/markers.min.js');
</script>
@endsection
