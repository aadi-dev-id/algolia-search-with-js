const { algoliasearch, instantsearch } = window;

const searchClient = algoliasearch('APP_ID', 'API_KEY');

const search = instantsearch({
  indexName: 'INDEX_NAME',
  searchClient,
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
//   instantsearch.widgets.hits({
//     container: '#hits',
//     templates: {
//       item: `
// <article>
//   <h1>{{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}</h1>
//   <p>{{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}</p>
//   <p>{{#helpers.highlight}}{ "attribute": "Price" }{{/helpers.highlight}}</p>
//   <img src={{#helpers.highlight}}{"attribute":"image"}{{/helpers.highlight}} style="height:100px">
// </article>
// `,
//     },
//   }),
//   instantsearch.widgets.configure({
//     hitsPerPage: 8,
//   }),
//   instantsearch.widgets.panel({
//     templates: { header: 'brand' },
//   })(instantsearch.widgets.refinementList)({
//     container: '#brand-list',
//     attribute: 'brand',
//   }),
//   instantsearch.widgets.panel({
//     templates: { header: 'Menu' },
//   })(instantsearch.widgets.hierarchicalMenu)({
//     container: '#menu-list',
//     attributes: ['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl3'],
//   }),
//   instantsearch.widgets.panel({
//     templates: { header: 'Price Range' },
//   })(instantsearch.widgets.rangeSlider)({
//     container: '[data-widget="price-range"]',
//     attribute: 'Price'
//   }),
  (instantsearch.widgets.sortBy)({
    container: '#sortBy',
    items: [
      { label: 'Featured', value: 'chaturbuy_demo' },
      { label: 'Price (asc)', value: 'chaturbuy_demo_Price_asc' },
      { label: 'Price (desc)', value: 'chaturbuy_demo_Price_desc' },
    ],
  }),

//   instantsearch.widgets.pagination({
//     container: '#pagination',
//   }),
]);
var html = null;
search.on('render', () => {
    // This event is triggered whenever the search results are rendered
    html = '';
    // console.log(results);
    (search.helper.lastResults.hits.forEach(element => {
        html += `<div class="col-lg-4 col-md-6 mb-2 pb-2">
        <div class="card d-flex flex-column align-items-center">
            <div class="product-name">${element.name}</div>
            <small>${element.brand}</small>
            <div class="card-img"> <img src="${element.image}" alt=""> </div>
            <div class="card-body pt-5">
                <div class="text-muted text-center mt-auto">Available Size</div>
                <div class="d-flex align-items-center justify-content-center colors my-2">
                ${element.Sizes.join()}
                </div>
                <div class="d-flex align-items-center price">
                    <div class="del mr-2"><span class="text-dark"><i class="fa fa-rupee-sign"></i>10000</span></div>
                    <div class="font-weight-bold"><i class="fa fa-rupee-sign"></i>${element.Price}</div>
                </div>
            </div>
        </div>
    </div>`;
    
    }));
    $("#products").html('<div class="row mx-0">'+html+'</div>');
});
search.on('click', ({ event, widget, results, clickedObject }) => {
  // This event is triggered when a search result is clicked
  console.log('Clicked result:', clickedObject);
});
var res = search.start();



/*******
 * 
 * 
 * 
 * 
 * instantsearch.widgets.rangeSlider
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 
const priceRangeSlider = panel({
  templates: {
    header: 'Price',
    collapseButtonText,
  },
  collapsed: () => false,
})(rangeSlider);


export const priceSlider = priceRangeSlider({
  container: '[data-widget="price-range"]',
  attribute: 'price',
  pips: false,
  tooltips: {
    format(value: number) {
      return `${Math.round(value).toLocaleString()}`;
    },
  },
});


********* */