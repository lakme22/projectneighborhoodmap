/**FLICKR
 * const key= '0ecbbdfb05ec682b91fba2dcf7f2c5bf'
 * const secret= '3738ee7262cb3dee'
 */

//key,results per request=10 
//let tag = this.props.modalTitle

export const fetchFlickrImages = (tag) => {
  let target = document.getElementById('images')
  let h = document.createElement("H1")
  let h2 = document.createElement("H2")

  const request = `https://api.flickr.com/services/rest/?
&api_key=0ecbbdfb05ec682b91fba2dcf7f2c5bf
&method=flickr.photos.search
&format=json&nojsoncallback=1
&per_page=10
&tag_mode=all
&tags=syros%2C+${tag}
`
  //console.log(request)
  fetch(request)
    .then(response => response.json())
    .then((data) => {

      if(data.photos.total<1){
        h2.innerHTML+='No Image from Flickr<br>We hope to fix this in the future';
        target.appendChild(h2);
        console.log('no photo')}

      data.photos.photo.forEach(({ farm, server, id, secret, title }) => {
        let a = document.createElement("a")
        let img = document.createElement("img");
        img.src = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`
        img.setAttribute("alt", `Image tile:${title}`)
        a.setAttribute("href", img.src)
        a.appendChild(img)
        target.appendChild(a)
      });
    })
    .catch(error => {       
    h.innerHTML+='No Network, <br> or no response from Flickr';
    target.appendChild(h);
    console.warn(error) })
}
