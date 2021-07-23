import IconsUtils from "./IconsUtils"

export default class SearchFilter extends IconsUtils{
    constructor(icons_arr, search_input, results_container, search_results=[]){
        super()
        this.icons_arr = icons_arr.sort()
        this.search_input = search_input
        this.search_results = search_results
        this.results_container = results_container

    }

    init(){
        this.search_input.addEventListener('input', (e)=>{
            e.preventDefault();
            if(e.data==="/")return;
            if(this.search_input.value.length === 0)this.removeAllChildNodes(this.results_container);
            if(this.search_input.value.length > 0){
                setTimeout(() => {
                    this.findMatch(this.search_input.value)
                }, 100);    
            };
        })
        document.addEventListener('keydown', (e)=>{
            if(e.code==='Slash'){
                e.preventDefault()
                this.search_input.focus()
            }
        })
        this.createStatsMarkup()
        return this
    }

    findMatch(value){
        this.cleanupResults()
        let matcher = new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),'i')
        let len = this.icons_arr.length;
        while (len--) {
            let element = this.icons_arr[len]
            if(element&&element.name && element.name.match(matcher)){
                this.search_results.push(element)
            }
        }
        this.plotMatches()

    }

    plotMatches(){
        this.search_results.forEach((icon)=>{
            let result_div = document.createElement('div')
            result_div.setAttribute('class', 'icon-wrapper')
            let result_img = document.createElement('img')
            let icon_name = document.createElement('span')
            icon_name.innerHTML = icon.name
            result_div.appendChild(icon_name)
            result_img.setAttribute('src', icon.static_url)
            result_img.setAttribute('loading', 'lazy')
            result_div.appendChild(result_img)
            this.results_container.appendChild(result_div)
            if(icon.src){
                this.importToSpriteMarkup([result_div])
            }else{
                this.addClipboard([result_div])
            }
            this.addDeleteButton([result_div])
            this.addRenameButton([result_div]) //slow mofo

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



}

