@foreach ($properties as $property)
<li>
   <div class="propertyCard see_prop_detail" data-target-id="{{$property->id}}" onmouseenter="showInfoBox(event)" >
     <!-- onclick="seePropDetail(event)" -->
      <div class="cardImgCol" data-bckgrnd-src="{{ $property->getMainImageUrl(true) }}"></div>
      <div class="cardTopSection">
         <p><i class="glyph-icon flaticon-signs-2"></i> {{$property->langAddress() ?: ''}}</p>
      </div>
      <a class="likePropertyIcon btn type bookmark map-bookmark" role="button" onclick="updateBookmark(event.target);" data-bookmark-state=''
                 data-prop-id="{{$property->id}}"
                 title="{{ trans('common.'.$property->pt) }}">
           <i class="fa fa-heart fa-1x" style="pointer-events:none" aria-hidden="true" style="pointer-events:none"></i>
           <span class="title-add" data-saved="{{trans('common.Saved')}}" data-save-this="{{ trans('common.SaveThis').' ' . $property->pt}}">{{ trans('common.SaveThis').' ' . trans('common.'. $property->pt) }}</span>
           <span class="title-added">{{ trans('common.Saved') }}</span></a>
      <div class="cardSec">
         <ul>
            <li>
               <div class="cardBtmContent">
                  <h4> <i class="glyph-icon flaticon-user-1"></i> {{ $property->pubName }}</h4>
                  <div class="priceSection">
                     <p class="orgPrice">@if($property->total_living_area) <i class="glyph-icon flaticon-up-arrow" title="{{trans('common.LivingArea')}}" data-placement="bottom"> {{isset($property->total_living_area) ? $property->total_living_area : ''}} {{$property->total_living_area_type=='sq.m.' ? 'm' : 'ft'}}<sup>2</sup> </i> @endif @if($property->rooms) <br><i class="glyph-icon flaticon-rest" title="{{trans('common.Rooms')}}" data-placement="bottom"> {{isset($property->rooms) ? $property->rooms : ''}} {{trans ('common.Rooms')}}</i> @endif</p>
                  </div>
               </div>
            </li>
            <li>
               <div class="cardBtmContent cardRight">
                 @php $status = $property->getStatus(); @endphp
                  <figure class="tag status"><span class="tag-Icon {{$status == trans('common.ForRent') ? 'rent-Icon' : 'sale-Icon'}}"></span> {!! $status !!}</figure>
                  <figure class="tag status"><span class="prop-type {{ trans('common.'.$property->pt) }}"></span> {{ trans('common.'.$property->pt) }}</figure>
                  <div class="priceSection">
                     @if ($property->price) @php $originalPrice=$property->originalPrice(); $exchangePrice=$property->exchangePrice(); @endphp
                     <p class="orgPrice" title="{{trans('common.InLocalCurrency')}}"> {{$originalPrice}}</p>
                     @if ($originalPrice !=$exchangePrice) <span class="highlightedText" title="{{trans('common.ExchangePrice')}}"> {{$exchangePrice}}</span> @endif @else
                     <p class="highlightedText"> {{trans('common.PriceOnRequest')}}</p>
                     @endif
                  </div>
               </div>
            </li>
         </ul>
      </div>
   </div>
</li>
@endforeach
