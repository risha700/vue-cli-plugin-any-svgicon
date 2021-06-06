
class SearchFilter{
    constructor(icons_arr, search_input, results_container, limit=5, search_results=[]){
        this.icons_arr = icons_arr
        this.search_input = search_input
        this.search_results = search_results
        this.results_container = results_container
        this.limit = limit
    }

    init(){
        this.search_input.addEventListener('input', ()=>{
            if(this.search_input.value == '')this.removeAllChildNodes(results_container);
            
            if (this.search_results.length >= limit_count){
                this.search_results.splice(0, this.search_results.length-limit_count)//undefiend
                this.cleanUpResults()
            }
            if(this.search_input.value != '')this.findMatch(this.search_input.value);

        })
        let icon_wrappers = document.getElementsByClassName('icon-wrapper')
        this.addClipboard(icon_wrappers)
    }

    findMatch(value){
        this.icons_arr.map((icon)=>{
            if (icon.name.includes(value) && !this.search_results.includes(icon))//regex better
            this.search_results.push(icon)
        })    
           //plot match
        this.plotMatches()
        // this.cleanUpResults()

    }



    plotMatches(){
        this.search_results.slice(Math.max(this.search_results.length - limit_count, 1)
        ).forEach((icon)=>{
            let result_div = document.createElement('div')
            result_div.setAttribute('class', 'icon-wrapper')
            let result_img = document.createElement('img')
             result_div.innerHTML = icon.name
             result_img.setAttribute('src', icon.path)
             result_div.appendChild(result_img)
            //  removeAllChildNodes(results_container)
             // cleanup
             this.results_container.childNodes.forEach((child)=>{
                child.innerText == icon.name ? this.results_container.removeChild(child):null
            })

            this.results_container.appendChild(result_div)
            this.addClipboard([result_div])

         })
    }


    //helper
    removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    cleanUpResults(){
        if(this.results_container.childElementCount > limit_count){
        for (let index = 0; index < this.results_container.childElementCount; index++) {
            this.results_container.removeChild(this.results_container.childNodes[index])
            }
        }
    }

    // clipboard
    copyToClipboard(e){
        let sudo_input = document.createElement('input')
        document.body.prepend(sudo_input)
        sudo_input.setAttribute('style','opacity:0;')
        console.log(e.path);
        sudo_input.value =  e.path[3].children[0].innerText
        sudo_input.focus()
        sudo_input.select()
        // sudo_input.setSelectionRange(0, 99999)
        document.execCommand('copy')
        document.body.removeChild(sudo_input)
    }

    addClipboard(icon_wrappers){
        // console.log('wrapper', icon_wrappers);
        Array.from(icon_wrappers).forEach((wrapper)=>{
            let clipboardBtn = document.createElement('button')
            clipboardBtn.setAttribute('class','clipboard-button')
            // clipboardBtn.addEventListener('click', this.copyToClipboard)
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
            clipboardBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/></svg>'
            wrapper.appendChild(clipboardBtn)
        })

    }
}

