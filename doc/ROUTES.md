# HTTP Routes

Routes to the openHAB Server provided by the multiuser filter proxy.

## openHAB App

Routes required for the openHAB mobile app.

path | method | response type / request type | resource / description | required filtering
-|-|-|-|-
/icon | GET | * | Icons | none
/rest/sitemaps | GET | application/json | Get all available sitemaps. | Remove Sitemap objects not allowed from the returned array.
/rest/sitemaps/{sitemapname} | GET | application/json | Get sitemap by name. | Reject request for Sitemap not allowed.
/rest/sitemaps/{sitemapname}/{pageid} | GET | application/json | Polls the data for a sitemap. | Reject request for Sitemap not allowed.
/rest/items/{itemname} | POST | text/plain | Sends a command to an item. | Reject access to Items not in allowed Sitemaps.

Always limit request methods to what is required.

## Items in a Sitemap

**GET** `/rest/sitemaps/{sitemapname}` returns a JSON that included the whole Sitemap definition. 
All Items' names can be parsed from all `item.name` (property name of object item).

