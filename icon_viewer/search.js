
class SearchFilter{
    constructor(icons_arr, search_input, results_container, search_results=[]){
        this.icons_arr = icons_arr
        this.search_input = search_input
        this.search_results = search_results
        this.results_container = results_container

    }

    init(){
        this.search_input.addEventListener('input', ()=>{
            if(this.search_input.value.length === 0)this.removeAllChildNodes(results_container);
            if(this.search_input.value.length > 0)this.findMatch(this.search_input.value);
        })
        let icon_wrappers = document.getElementsByClassName('icon-wrapper')
        this.addClipboard(icon_wrappers)
    }

    findMatch(value){
        this.cleanupResults()
        this.icons_arr.map((icon)=>{
            if (icon.name.includes(value))//regex better
            this.search_results.push(icon)
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
            this.addClipboard([result_div])

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

