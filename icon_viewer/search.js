class SearchFilter{
    constructor(icons_arr, search_input, results_container, search_results=[]){
        this.icons_arr = icons_arr.sort()
        this.search_input = search_input
        this.search_results = search_results
        this.results_container = results_container

    }

    init(){
        this.search_input.addEventListener('input', ()=>{
            if(this.search_input.value.length === 0)this.removeAllChildNodes(results_container);
            if(this.search_input.value.length > 0)this.findMatch(this.search_input.value);
        })
        return this
    }

    findMatch(value){
        this.cleanupResults()
        Object.values(this.icons_arr).forEach((obj, _)=>{
            if (obj.name.includes(value))//regex better
            this.search_results.push(obj)
        })    
        this.plotMatches()

    }

    plotMatches(){
        this.search_results.forEach((icon)=>{
            let result_div = document.createElement('div')
            result_div.setAttribute('class', 'icon-wrapper')
            let result_img = document.createElement('img')
            result_div.innerHTML = icon.name
            result_img.setAttribute('src', icon.static_url)
            result_div.appendChild(result_img)
            this.results_container.appendChild(result_div)
            if(icon.src){
                this.importToSpriteMarkup([result_div])
            }else{
                this.addClipboard([result_div])
            }
            this.addDeleteButton([result_div])
         })
    }

    //helper
    removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    cleanupResults(){
        this.search_results = []
        this.removeAllChildNodes(this.results_container)
    }
    addClipboard(icon_wrappers){
        // console.log('wrapper', icon_wrappers);
        Array.from(icon_wrappers).forEach((wrapper)=>{
            let clipboardBtn = document.createElement('button')
            clipboardBtn.setAttribute('class','clipboard-button')
            clipboardBtn.addEventListener('click', ()=>{
                let sudo_input = document.createElement('input')
                wrapper.appendChild(sudo_input)
                sudo_input.setAttribute('style','opacity:0;')
                sudo_input.value =  wrapper.innerText
                sudo_input.focus()
                sudo_input.select()
                // sudo_input.setSelectionRange(0, 99999)
                document.execCommand('copy')
                wrapper.removeChild(sudo_input)
            })
            clipboardBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><title>copy icon name</title><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/></svg>'
            wrapper.appendChild(clipboardBtn)
        })

    }

     importToSpriteMarkup(iconWrappers){
        Array.from(iconWrappers).forEach((iconWrapper)=>{
            let importBtn = document.createElement('button')
            importBtn.setAttribute('class','clipboard-button')
            importBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><title>import to sprite sheet</title><path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>`
            importBtn.addEventListener('click', async function(){
                let icon_data = Object.values(this.icons_arr).find(item=>item.name===iconWrapper.innerText)
                let respone = await this.postData('import', {data:icon_data})
                let containers = document.getElementsByClassName('icons-container')
                let document_wrappers = document.querySelectorAll('.icon-wrapper')
                document_wrappers = Array.from(document_wrappers).filter((r)=>r.innerText===iconWrapper.innerText)

                
                Array.from(containers).forEach((container)=>{
                    document_wrappers.forEach((doc_wrap)=>{
                        console.log('in_old',container.contains(doc_wrap));
                        if(container.contains(doc_wrap)){
                            console.log('equals', (doc_wrap.outerHTML===iconWrapper.outerHTML));
                            if(doc_wrap.outerHTML===iconWrapper.outerHTML)
                            doc_wrap.removeAttribute('type')
                            doc_wrap.setAttribute('type', 'sprite-icon')
                            doc_wrap.removeChild(doc_wrap.childNodes[2])
                            this.addClipboard([doc_wrap])
                        }
                    })
          
                    console.log(document_wrappers)
                })

                let idx = Object.values(this.icons_arr).findIndex(item=>item.name===icon_data.name)
                this.icons_arr[idx]['src'] = false

                console.log(respone.status)
            }.bind(this))
            iconWrapper.appendChild(importBtn)
        })
    }
    addDeleteButton(iconWrappers){
        Array.from(iconWrappers).forEach((iconWrapper)=>{
            let deleteBtn = document.createElement('button')
            deleteBtn.setAttribute('class','clipboard-button delete-button')
            deleteBtn.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><title>delete icon</title><path d="M0 0h24v24H0z" stroke="none"/><path d="M3 3l18 18M4 7h3m4 0h9M10 11v6M14 14v3M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l.077-.923M18.384 14.373L19 7M9 5V4a1 1 0 011-1h4a1 1 0 011 1v3"/></svg>`
            deleteBtn.addEventListener('click', async function(){
                let icon_data = Object.values(this.icons_arr).find(item=>item.name===iconWrapper.innerText)
                let respone = await this.postData('delete', {data:icon_data})
                let containers = document.getElementsByClassName('icons-container')
                Array.from(containers).forEach((container)=>{
                    if(container.contains(iconWrapper)){
                        container.removeChild(iconWrapper)
                    }
                })
      
                this.icons_arr = Object.values(this.icons_arr).filter(item=>item.name!==icon_data.name)
                console.log(respone.status)
            }.bind(this))
            iconWrapper.appendChild(deleteBtn)
        })
    }
    async postData(url = '', data = {}) {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });
        return response.json()
      }
}

