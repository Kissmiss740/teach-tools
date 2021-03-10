export const html_to_word = (html) => {
    var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
        "xmlns:w='urn:schemas-microsoft-com:office:word' " +
        "xmlns='http://www.w3.org/TR/REC-html40'>" +
        "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
    var footer = "</body></html>";
    var sourceHTML = header + html + footer;

    var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    var fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = 'document.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);
}

export const create_flow_table = (list) => {
    let header = `
  <table cellspacing="0" cellpadding="0" align="center" width="100%">
    <tbody>
        <tr style="height:42px;" class="firstRow">
            <td colspan="4" valign="top" style="border: 1px solid black;  border-image: initial; background: rgb(243, 243, 243); padding: 0px;" height="42">
                <p style="margin-top:9px"><strong><span style="font-size:19px">六、教学流程 </span></strong></p>
            </td>
        </tr>
        <tr style="height:1px;" class="firstRow">
            <td width="110" style="border: 1px solid black; background: rgb(68, 114, 196); padding: 5px 10px;" height="1">
                <p style="text-align:center"><strong><span style="font-size:   19px;font-family:宋体;color:white">环节</span></strong></p>
            </td>
            <td style="border-top: 1px solid black; border-right: 1px solid black; border-bottom: 1px solid black; border-left: none black; background: rgb(68, 114, 196); padding: 5px 10px; border-image: initial;" height="1" width="100">
                <p style="text-align:center"><strong><span style="font-size:   19px;font-family:宋体;color:white">时间</span></strong></p>
            </td>
            <td style="border-top: 1px solid black; border-right: 1px solid black; border-bottom: 1px solid black; border-left: none black; background: rgb(68, 114, 196); padding: 5px 10px; border-image: initial;" height="1" >
                <p style="text-align:center"><strong><span style="font-size:   19px;font-family:宋体;color:white">活动</span></strong></p>
            </td>
            <td style="border-top: 1px solid black; border-right: 1px solid black; border-bottom: 1px solid black; border-left: none black; background: rgb(68, 114, 196); padding: 5px 10px; border-image: initial;" height="1" >
                <p style="text-align:center"><strong><span style="font-size:   19px;font-family:宋体;color:white">资源</span></strong></p>
            </td>
        </tr>
  `
    let body = ''
    for (let i = 0, len = list.length; i < len; i++) {

        let row = `<tr style=";height:1px">
  <td width="110"
      style="border-right: 1px solid black; border-bottom: 1px solid black; border-left: 1px solid black; border-top: none; background: rgb(207, 213, 234); padding: 5px 10px; border-image: initial; word-break: break-all;"
      height="1"
      align="center"
      valign="top">${list[i]['title']}</td>
  <td width="100"
      style="border-top: none; border-left: none; border-bottom: 1px solid black; border-right: 1px solid black; background: rgb(207, 213, 234); padding: 5px 10px; word-break: break-all;"
      height="1"
      align="center"
      valign="top">${list[i]['time']||0}分钟</td>
  <td valign="top"
      style="border-top: none; border-left: none; border-bottom: 1px solid black; border-right: 1px solid black; background: rgb(207, 213, 234); padding: 5px 10px; word-break: break-all;"
      height="1"
      align="center"><br></td>
  <td style="border-top: none; border-left: none; border-bottom: 1px solid black; border-right: 1px solid black; background: rgb(207, 213, 234); padding: 5px 10px;"
      height="1"
      align="center"
      valign="top"><br></td>
 </tr>`
        body += row
    }
    let footer = '</tbody></table>'
    return header + body + footer
}

export const saveContentToLocal = (item, value) => {
    let key = 'content'
    let content = localStorage.getItem(key)
    let preJson = content ? JSON.parse(content) : {}
    preJson[item] = value
    localStorage.setItem(key, JSON.stringify(preJson))
}

export const getContentFromLocal = (item) => {
    let key = 'content'
    let content = localStorage.getItem(key)
    let preJson = content ? JSON.parse(content) : {}
    return preJson[item] || ''
}
/**
 * @description 保存已选环境到local storage
 * @param {string} key 
 * @param {Array} arr 已选环境的数组
 * @returns 
 */
export const set_localStorage_checkedEnv = (key, arr) => {
    let value = arr.join('、')
    localStorage.setItem(key, value)
}
/**
 * @description 获取已选环境的数组
 * @param {string} key 
 * @returns {Array}已选环境的数组
 */
export const get_localStorage_checkedEnv = (key) => {
    let value = localStorage.getItem(key)
    let arr = value ? value.split('、') : []
    return arr
}