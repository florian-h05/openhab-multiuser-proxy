# HTTP Routes

Routes to the openHAB Server provided by the multiuser filter proxy.

## openHAB App

Routes required for the openHAB mobile app.

path | method | response type / request type | resource / description | required filtering | Approach
-|-|-|-|-|-
/icon | GET | * | Icons | none | Forward all requests in NGINX.
/rest/sitemaps | GET | application/json | Get all available sitemaps. | Remove Sitemap objects not allowed from the returned array. | Use NodeJS application to request all Sitemaps from openHAB and remove unallowed from response.
/rest/sitemaps/{sitemapname} | GET | application/json | Get sitemap by name. | Reject request for Sitemap not allowed. | Use NodeJS application for response handling.
/rest/sitemaps/{sitemapname}/{pageid} | GET | application/json | Polls the data for a sitemap. | Reject request for Sitemap not allowed. | Use NodeJS application for response handling.
/rest/items/{itemname} | POST | text/plain | Sends a command to an item. | Reject access to Items not in allowed Sitemaps. | Use NodeJS application for Use NodeJS application for NGINX ``auth_request``. Parse all items from Sitemap.

Always limit request methods to what is required.
