export default class IconsUtils{
    constructor(){}
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

    addClipboard(icon_wrappers){
      Array.from(icon_wrappers).forEach((wrapper)=>{
          let clipboardBtn = document.createElement('button')
          clipboardBtn.setAttribute('class','clipboard-button')
          clipboardBtn.addEventListener('click', async ()=>{
              await navigator.clipboard.writeText(wrapper.innerText)
          })
          clipboardBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><title>copy icon name</title><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/></svg>'
          wrapper.appendChild(clipboardBtn)
      })

  }

  addDeleteButton(iconWrappers){
    Array.from(iconWrappers).forEach((iconWrapper)=>{
        let deleteBtn = document.createElement('button')
        deleteBtn.setAttribute('class','clipboard-button delete-button')
        deleteBtn.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><title>delete icon</title><path d="M0 0h24v24H0z" stroke="none"/><path d="M3 3l18 18M4 7h3m4 0h9M10 11v6M14 14v3M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l.077-.923M18.384 14.373L19 7M9 5V4a1 1 0 011-1h4a1 1 0 011 1v3"/></svg>`
        deleteBtn.addEventListener('click', ()=>{this.deleteIcon(iconWrapper)},false)
        iconWrapper.appendChild(deleteBtn)
    })
  }

  async deleteIcon(iconWrapper){
    let icon_data = Object.values(this.icons_arr).find(item=>item.name===iconWrapper.innerText)
    let respone = await this.postData('delete', {data:icon_data})
    let containers = document.getElementsByClassName('icons-container')
    Array.from(containers).forEach((container)=>{
        if(container.contains(iconWrapper)){
            container.removeChild(iconWrapper)
        }
    })
    this.icons_arr = Object.values(this.icons_arr).filter(item=>item.name!==icon_data.name)
    // console.log(respone.status)
  }

  importToSpriteMarkup(iconWrappers){
    Array.from(iconWrappers).forEach((iconWrapper)=>{
        let importBtn = document.createElement('button')
        importBtn.setAttribute('class','clipboard-button')
        importBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><title>import to sprite sheet</title><path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>`
        importBtn.addEventListener('click', async ()=>{
          await this.importIcon(iconWrapper)
        })
        iconWrapper.appendChild(importBtn)
    })
  }

  async importIcon(iconWrapper){
    let icon_data = Object.values(this.icons_arr).find(item=>item.name===iconWrapper.innerText)
    let respone = await this.postData('import', {data:icon_data})
    let containers = document.getElementsByClassName('icons-container')
    let document_wrappers = document.querySelectorAll('.icon-wrapper')
    document_wrappers = Array.from(document_wrappers).filter((r)=>r.innerText===iconWrapper.innerText)    
    Array.from(containers).forEach((container)=>{
        document_wrappers.forEach((doc_wrap)=>{
            if(container.contains(doc_wrap)){
                if(doc_wrap.outerHTML===iconWrapper.outerHTML)
                doc_wrap.removeAttribute('type')
                doc_wrap.setAttribute('type', 'sprite-icon')
                doc_wrap.removeChild(doc_wrap.childNodes[2])
                this.addClipboard([doc_wrap])
            }
        })
    })

    let idx = Object.values(this.icons_arr).findIndex(item=>item.name===icon_data.name)
    this.icons_arr[idx]['src'] = false
    // console.log(respone.status)
  }

  async getStats(){
    let data = await fetch('stats')
    let stats = await data.json()
    return stats
  }

  humanFileSize(size) {
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
  }
  async createStatsMarkup(){
    let {size, count} = await this.getStats()
    let states_elm = document.getElementsByClassName('stats')[0]
    this.removeAllChildNodes(states_elm)
    states_elm.innerText = `sprite sheet size ${this.humanFileSize(size)} / ${count} icons`
    let refresh_btn = document.createElement('button')
    refresh_btn.setAttribute('role', 'button')
    refresh_btn.innerHTML ='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" role="button" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>'
    states_elm.appendChild(refresh_btn)
    refresh_btn.addEventListener('click', this.createStatsMarkup.bind(this), false)

  }
}

