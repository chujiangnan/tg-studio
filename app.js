const KEY="tgstudio_mobile_v010";
const emptyState={accounts:[],contacts:[],templates:[],tasks:[],logs:[]};
let state=load();
function load(){try{return {...emptyState,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return structuredClone(emptyState)}}
function save(){localStorage.setItem(KEY,JSON.stringify(state));render()}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function log(action,detail=""){state.logs.unshift({id:crypto.randomUUID(),action,detail,time:new Date().toLocaleString("zh-CN")});state.logs=state.logs.slice(0,150)}
let toastTimer;
function toast(msg){const el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2200)}
function go(page){document.querySelectorAll(".page").forEach(x=>x.classList.toggle("active",x.id==="page-"+page));document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x.dataset.page===page));window.scrollTo({top:0,behavior:"smooth"})}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>go(b.dataset.page)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
document.getElementById("accountForm").addEventListener("submit",e=>{e.preventDefault();state.accounts.push({id:crypto.randomUUID(),label:accountLabel.value.trim(),phone:accountPhone.value.trim(),created:Date.now()});log("添加账号资料",accountLabel.value.trim());e.target.reset();save();toast("账号资料已添加")});
document.getElementById("contactForm").addEventListener("submit",e=>{e.preventDefault();if(!contactConsent.checked)return toast("请先确认已取得联系人同意");state.contacts.push({id:crypto.randomUUID(),name:contactName.value.trim(),handle:contactHandle.value.trim(),consent:true,created:Date.now()});log("添加授权联系人",contactName.value.trim());e.target.reset();save();toast("联系人已加入授权名单")});
document.getElementById("templateForm").addEventListener("submit",e=>{e.preventDefault();state.templates.push({id:crypto.randomUUID(),name:templateName.value.trim(),body:templateBody.value.trim(),created:Date.now()});log("保存消息模板",templateName.value.trim());e.target.reset();save();toast("模板已保存")});
document.getElementById("taskTemplate").addEventListener("change",e=>{const t=state.templates.find(x=>x.id===e.target.value);if(t)document.getElementById("taskBody").value=t.body});
document.getElementById("taskForm").addEventListener("submit",e=>{e.preventDefault();const ids=[...document.querySelectorAll("#taskTargets input:checked")].map(x=>x.value);if(!ids.length)return toast("至少选择一位已授权联系人");const t={id:crypto.randomUUID(),name:taskName.value.trim(),body:taskBody.value.trim(),templateId:taskTemplate.value,targetIds:ids,created:Date.now(),status:"草稿"};state.tasks.unshift(t);log("创建任务草稿",`${t.name} · ${ids.length} 位授权联系人`);e.target.reset();save();toast("任务草稿已保存，未发送")});
function remove(type,id){const map={accounts:"accounts",contacts:"contacts",templates:"templates",tasks:"tasks"};const key=map[type];const item=state[key].find(x=>x.id===id);if(!item)return;if(!confirm("确定删除这条记录？"))return;state[key]=state[key].filter(x=>x.id!==id);log("删除记录",item.name||item.label||item.handle||type);save();toast("已删除")}
function item(title,sub,type,id,extra=""){return `<div class="item"><div class="item-main"><b>${esc(title)}</b><small>${esc(sub)}${extra}</small></div><div class="item-actions"><button class="mini-btn delete" data-remove="${type}" data-id="${id}">删除</button></div></div>`}
function render(){
 statAccounts.textContent=state.accounts.length;statContacts.textContent=state.contacts.length;statTemplates.textContent=state.templates.length;statTasks.textContent=state.tasks.length;
 accountCount.textContent=state.accounts.length+" 条";contactCount.textContent=state.contacts.length+" 条";templateCount.textContent=state.templates.length+" 条";taskCount.textContent=state.tasks.length+" 条";
 accountList.innerHTML=state.accounts.length?state.accounts.map(x=>item(x.label,x.phone||"未填写手机号","accounts",x.id)).join(""):'<div class="empty">还没有账号资料</div>';
 contactList.innerHTML=state.contacts.length?state.contacts.map(x=>item(x.name,x.handle,"contacts",x.id," · 已确认授权")).join(""):'<div class="empty">还没有授权联系人</div>';
 templateList.innerHTML=state.templates.length?state.templates.map(x=>item(x.name,x.body.slice(0,90),"templates",x.id)).join(""):'<div class="empty">还没有消息模板</div>';
 taskList.innerHTML=state.tasks.length?state.tasks.map(x=>item(x.name,`${x.targetIds.length} 位授权联系人 · ${x.status} · ${x.body.slice(0,65)}`,"tasks",x.id)).join(""):'<div class="empty">还没有任务草稿</div>';
 taskTemplate.innerHTML='<option value="">选择模板（可选）</option>'+state.templates.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join("");
 taskTargets.classList.toggle("empty",!state.contacts.length);taskTargets.innerHTML=state.contacts.length?state.contacts.map(x=>`<label class="target-option"><input type="checkbox" value="${x.id}"><span>${esc(x.name)} · ${esc(x.handle)}</span></label>`).join(""):"请先在联系人管理中添加并确认授权联系人。";
 logList.innerHTML=state.logs.length?state.logs.map(x=>`<div class="item"><div class="item-main"><b>${esc(x.action)}</b><small>${esc(x.detail)} · ${esc(x.time)}</small></div></div>`).join(""):'<div class="empty">暂无操作日志</div>';
 document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>remove(b.dataset.remove,b.dataset.id));
}
document.getElementById("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="tg-studio-backup-"+new Date().toISOString().slice(0,10)+".json";a.click();URL.revokeObjectURL(url);toast("备份文件已生成")};
document.getElementById("clearLogsBtn").onclick=()=>{if(confirm("确定清空操作日志？")){state.logs=[];save();toast("日志已清空")}};
document.getElementById("resetBtn").onclick=()=>{if(confirm("这会删除本浏览器中的全部 TG Studio 演示数据，且无法撤销。继续？")){state=structuredClone(emptyState);save();toast("本机演示数据已删除")}};
document.getElementById("installBtn").onclick=()=>toast("在 Safari 分享菜单中选择“添加到主屏幕”");
render();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
