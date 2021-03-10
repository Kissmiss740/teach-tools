 import {
     CreateOneFile
 } from '@/api'
 import store from '@/store'
 const Teach_Env = `
 <table cellspacing="0" cellpadding="0" width="100%">
     <tbody>
         <tr style=";height:42px" class="firstRow">
             <td width="1034" colspan="6" valign="top" style="border: 1px solid black;  border-image: initial; background: rgb(243, 243, 243); padding: 0px;" height="42">
                 <p style="margin-top:9px">
                     <strong><span style="font-size:19px">五、教学环境 </span></strong>
                 </p>
             </td>
         </tr>
         <tr>
             <td width="1034" colspan="6" style="border-right: 1px solid black; border-bottom: 1px solid black; border-left: 1px solid black; border-image: initial; border-top: none; padding: 0px;">
                 <p style="margin-top:10px;margin-right:2px;margin-bottom:0;margin-left:7px;margin-bottom:0;text-align:justify;text-justify:inter-ideograph;text-indent:32px" dir="ltr">
                     硬件环境：
                 </p>
                 <p style="margin-top:10px;margin-right:2px;margin-bottom:0;margin-left:7px;margin-bottom:0;text-align:justify;text-justify:inter-ideograph;text-indent:32px">
                     软件环境：
                 </p>
             </td>
         </tr>
     </tbody>
 </table>
 `
 const Teach_Flow = `
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
             <td style="border-top: 1px solid black; border-right: 1px solid black; border-bottom: 1px solid black; border-left: none black; background: rgb(68, 114, 196); padding: 5px 10px; border-image: initial;" height="1">
                 <p style="text-align:center"><strong><span style="font-size:   19px;font-family:宋体;color:white">活动</span></strong></p>
             </td>
             <td style="border-top: 1px solid black; border-right: 1px solid black; border-bottom: 1px solid black; border-left: none black; background: rgb(68, 114, 196); padding: 5px 10px; border-image: initial;" height="1" >
                 <p style="text-align:center"><strong><span style="font-size:   19px;font-family:宋体;color:white">资源</span></strong></p>
             </td>
         </tr>
         <tr style="height:1px;">
             <td style="border-right: 1px solid black; border-bottom: 1px solid black; border-left: 1px solid black; border-top: none black; background: rgb(207, 213, 234); padding: 5px 10px; border-image: initial;" height="1" width="110"></td>
             <td style="border-top: none black; border-left: none black; border-bottom: 1px solid black; border-right: 1px solid black; background: rgb(207, 213, 234); padding: 5px 10px;" height="1" width="100"></td>
             <td valign="top" style="border-top: none black; border-left: none black; border-bottom: 1px solid black; border-right: 1px solid black; background: rgb(207, 213, 234); padding: 5px 10px;" height="1"></td>
             <td style="border-top: none black; border-left: none black; border-bottom: 1px solid black; border-right: 1px solid black; background: rgb(207, 213, 234); padding: 5px 10px;" height="1" ></td>
         </tr>
     </tbody>
 </table>
 `
 const html_to_word = (html, filename) => {
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
     fileDownload.download = filename + '.doc';
     fileDownload.click();
     document.body.removeChild(fileDownload);
 }
 export const download_word = (content, filename, hardEnv, softEnv) => {
     let fileName = filename || ''
     let json = typeof content === 'string' ? JSON.parse(content) : content
     let Teach_Hard_Env = hardEnv || ''
     let Teach_Soft_Env = softEnv || ''
     if (!json['Teach_Env']) {
         json['Teach_Env'] = Teach_Env
     }
     if (Teach_Hard_Env) {
         let value = '硬件环境：' + Teach_Hard_Env
         json['Teach_Env'] = json['Teach_Env'].replace('硬件环境：', value)
     }
     if (Teach_Soft_Env) {
         let value = '软件环境：' + Teach_Soft_Env
         json['Teach_Env'] = json['Teach_Env'].replace('软件环境：', value)
     }
     let modes = [
         'CourseBrief',
         'Academic_Analysis',
         'Teach_Demand',
         'Teach_Hard',
         'Teach_Env',
         'Teach_Flow',
         'Teach_Evaluate'
     ]
     let html = ''
     modes.forEach(item => {
         html += json[item]
     })
     html_to_word(html, fileName)
 }

 export const init_file = () => {

     const content = {
         CourseBrief: '',
         Academic_Analysis: '',
         Teach_Demand: '',
         Teach_Hard: '',
         Teach_Env: Teach_Env,
         Teach_Flow: Teach_Flow,
         Teach_Evaluate: ''
     }
     localStorage.setItem('Teach_Hard_Env', '')
     localStorage.setItem('Teach_Soft_Env', '')
     localStorage.setItem('content', JSON.stringify(content))
     content['Teach_Hard_Env'] = ''
     content['Teach_Soft_Env'] = ''
     return content
 }
 export const create_new_file = ({
     name,
     type,
     username,
     content
 }) => {
     return CreateOneFile({
             name,
             type,
             username,
             content
         })
         .then(data => {
             localStorage.setItem('file_id', data.id)
             store.commit('FILENAME', data.name)
             store.commit('FILETYPE', data.type)
             return Promise.resolve(data.id)
         })
         .catch(err => {
             return Promise.reject(err)
         })
 }