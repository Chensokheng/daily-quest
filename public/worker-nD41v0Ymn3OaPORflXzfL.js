self.addEventListener("push",(async i=>{const{message:n,body:t,icon:e}=JSON.parse(i.data.text());i.waitUntil(self.registration.showNotification(n,{body:t,icon:e}))})),self.addEventListener("notificationclick",(i=>{i.notification.close(),i.waitUntil(clients.matchAll({type:"window"}).then((i=>{for(const n of i)if("/"===n.url&&"focus"in n)return n.focus();if(clients.openWindow)return clients.openWindow("/")})))}));