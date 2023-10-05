const { algoliasearch, instantsearch } = window;

const searchClient = algoliasearch('APP_ID', 'API_KEY');

let dataloaded = false; 
var list = null; 
var check = null; 
var clas = null; 
let pagination = 1; 
let pageLimit = 10; 
let totalrecords = 0; 
let searchIndex = 'INDEX_NAME'; 

$(document).ready(function () { 
    $('#searchtxt').on("keyup", function(e){ 
      getProduct(e.target.value); 
    });  
}); 

getProduct();

function getfilterAttribute(type){
  var checkedValue = [];
  var value = '';
  let indexToRemove = -1;
  $('.'+type).each((i,elem)=>{
    value = $(elem).val();
    if($(elem).is(":checked")){
        if((!checkedValue.includes(value))){
          checkedValue.push(value)
        }
    }else{
        indexToRemove = checkedValue.indexOf(value);
        if (indexToRemove !== -1) {
          checkedValue.splice(indexToRemove, 1);
        }
    }
  });
  return checkedValue.length > 0 ? checkedValue : false;
}

// // function getFilter(){
// //   var filter = '';
// //   var brand = getfilterAttribute('brand');
// //   if(brand){
// //     brand = brand.join(" OR ");
// //     filter = "brand: '"+brand+"'";
// //   }
// //   var category = getfilterAttribute('category');
// //   if(category){
// //     category = category.join(" OR ");
// //     if(filter!=""){
// //       filter += " AND hierarchicalCategories.lvl0: '"+category+"'";
// //     }else{
// //       filter = "hierarchicalCategories.lvl0: "+category+"'";
// //     }
// //   }
// //   return filter;
// // }
function getFilter(){
  var filter = [];
  var brand = getfilterAttribute('brand');
  if(brand){
    brand = brand.map(function(ele){ return `Brand:${ele}`; });
    filter.push(brand);
  }
  var category = getfilterAttribute('category');
  if(category){
    category = category.map(function(ele){ return `hierarchicalCategories.lvl0:${ele}`; });
    filter.push(category);
  }
  console.log(filter);
  return filter;
}
function getPage(){
  return pagination;
}
function getPriceFilter(){
  var min = parseInt($('#input-left').val());
  var max = parseInt($('#input-right').val());
  // return (min && max) ? [`'Price: ${min} TO ${max}'`] : [];
  return (min && max) ? [[`Price > ${min}`], [`Price < ${max}`]] : [];
}
function getPageLimit(){
  return pageLimit;
}
function getIndexName(){
  return searchIndex;
}
function getProduct(query=''){
  var filter = getFilter();
  var page = getPage()-1;
  var priceFilter = getPriceFilter();
  var limit = getPageLimit();
  console.log("Inination");
  var indexName = getIndexName();
  searchClient.search([
    {
      indexName: indexName,
      query: query,
      page : page,
      hitsPerPage: limit,
      numericFilters : priceFilter,
      facetFilters : filter,
      facets: ['Brand','hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2'],
    },
  ])
  .then(({ results }) => {
    // Handle the search results
    console.log('Search Results:', results);
    if(results[0].facets?.Brand && !dataloaded){
      var brand = results[0].facets.Brand;
      list = '';
      for (const key in brand) {
        if (Object.hasOwnProperty.call(brand, key)) {
          clas = key.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
          check = $('#inner-box div').hasClass(clas) ? $('#inner-box div.'+clas+' input').is(':checked') : false;
          list += `<div class="my-1 ${clas}"> <label class="tick">${key} - ${brand[key]}<input class="brand" value="${key}" type="checkbox" ${check?'checked':''}> <span class="check"></span> </label> </div>`;
        }
      }
      $('#inner-box').html(list);
    }
    if(Boolean(results[0].facets["hierarchicalCategories.lvl0"]) && !dataloaded){
      var category = results[0].facets["hierarchicalCategories.lvl0"];
      list = '';
      for (const key in category) {
        if (Object.hasOwnProperty.call(category, key)) {
          clas = key.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
          check = $('#inner-box2 div').hasClass(clas) ? $('#inner-box2 div.'+clas+' input').is(':checked') : false;
          list += `<div class="my-1 ${clas}"> <label class="tick">${key} - ${category[key]} <input class="category" value="${key}" type="checkbox" ${check?'checked':''}> <span class="check"></span> </label> </div>`;
        }
      }
      $('#inner-box2').html(list);
    }
    
    if(Boolean(results[0].hits) && results[0].hits.length > 0){
      html = '';
      results[0].hits.forEach(element => {
        html += `<div class="col-lg-4 col-md-6 mb-2 pb-2">
            <div class="card d-flex flex-column align-items-center">
                <div class="product-name">${element.Title}</div>
                <small>${element.Brand}</small>
                <div class="card-img"> <img src="${element.Image}" alt=""> </div>
                <div class="card-body pt-5">
                    <div class="text-muted text-center mt-auto">Available Size</div>
                    <div class="d-flex align-items-center justify-content-center colors my-2">
                    ${element.Sizes}
                    </div>
                    <div class="d-flex align-items-center price">
                        <div class="del mr-2"><span class="text-dark"><i class="fa fa-rupee-sign"></i>10000</span></div>
                        <div class="font-weight-bold"><i class="fa fa-rupee-sign"></i>${element.Price}</div>
                    </div>
                </div>
            </div>
        </div>`;
      });
      $("#products").html('<div class="row mx-0">'+html+'</div>');
    } 
    !dataloaded ? refreshDom() : '';
    dataloaded = true;
    console.log("END");
    // // Access the facets
    // const categoryFacets = results.getFacetValues('hierarchicalCategories');
    // const otherFacetFacets = results.getFacetValues('other_facet_attribute');

    // console.log('Category Facets:', categoryFacets);
    // console.log('Other Facet Facets:', otherFacetFacets);

    // Now you can use the results and facets to update your UI or perform other actions
    $("#inner-box").removeClass('no-pointer');
    $("#inner-box2").removeClass('no-pointer');
  })
  .catch(error => {
    console.error('Search Error:', error);
    $("#inner-box").removeClass('no-pointer');
    $("#inner-box2").removeClass('no-pointer');
  });
}

function refreshDom(){
  $('.brand').on("change", function(e){
    e.preventDefault();
    $("#inner-box").addClass('no-pointer');
    $("#inner-box2").addClass('no-pointer');
    getProduct($('#searchtxt').val());
  });
  $('.category').on("change", function(e){
    e.preventDefault();
    $("#inner-box").addClass('no-pointer');
    $("#inner-box2").addClass('no-pointer');
    getProduct($('#searchtxt').val());
  })
}

function page(type){
  pagination = type=='next' ? pagination + 1 : pagination - 1;
  $('.pagination li:first + li a').html(pagination); 
  pagination > 1 ? $('.pagination li:first').removeClass('no-pointer') : ($('.pagination li:first').hasClass('no-pointer') ? '': $('.pagination li:first').addClass('no-pointer'));
  getProduct($('#searchtxt').val());
}

//range slider
$('input[type=range]').on("change", function(e){
  e.preventDefault();
  getProduct($('#searchtxt').val());
})
$('#pro').on("change", function(e){
  e.preventDefault();
  pageLimit = e.target.value;
  getProduct($('#searchtxt').val());
});
$('#sortBy').on("change", function(e){
  e.preventDefault();
  searchIndex = e.target.value=='' ? 'INDEX_NAME' : e.target.value;
  getProduct($('#searchtxt').val());
});
