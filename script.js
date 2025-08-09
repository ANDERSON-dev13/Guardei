// Persistência
const STORAGE_KEY = "guardei.metas.v1";
let goals = loadGoals();

function loadGoals(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY))||[] }catch{return []} }
function saveGoals(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(goals)); }

// Seletores
const form = document.getElementById("goalForm");
const tbody = document.querySelector("#goalsTable tbody");

// Helpers
const fmtBRL = (n)=> new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n);

// Render
function renderGoals(){
  tbody.innerHTML = "";
  goals.forEach((g, i)=>{
    const monthly = g.months ? (g.value / g.months) : 0;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${g.name}</td>
      <td>${fmtBRL(g.value)}</td>
      <td>${g.months}</td>
      <td><strong>${fmtBRL(monthly)}</strong></td>
      <td class="actions-row">
        <button class="btn-secondary" data-action="edit" data-index="${i}">Editar</button>
        <button class="btn-danger" data-action="del" data-index="${i}">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Eventos
form.addEventListener("submit", (e)=>{
  e.preventDefault();
  const name = document.getElementById("goalName").value.trim();
  const value = parseFloat(document.getElementById("goalCost").value);
  const months = parseInt(document.getElementById("goalMonths").value, 10);

  if(!name || isNaN(value) || isNaN(months) || value<=0 || months<=0){
    alert("Preencha todos os campos corretamente."); return;
  }

  goals.push({ name, value, months });
  saveGoals(); renderGoals(); form.reset();
});

tbody.addEventListener("click", (e)=>{
  const btn = e.target.closest("button"); if(!btn) return;
  const idx = parseInt(btn.dataset.index, 10);
  const action = btn.dataset.action;
  if(action === "del"){
    goals.splice(idx,1); saveGoals(); renderGoals();
  } else if(action === "edit"){
    const g = goals[idx];
    const name = prompt("Nome da meta:", g.name) ?? g.name;
    const value = parseFloat((prompt("Valor total (R$):", g.value) ?? g.value).toString().replace(",","."));
    const months = parseInt((prompt("Meses para guardar:", g.months) ?? g.months).toString(),10);
    if(!name || isNaN(value) || isNaN(months) || value<=0 || months<=0) return;
    goals[idx] = { name, value, months }; saveGoals(); renderGoals();
  }
});

// SW (opcional)
if("serviceWorker" in navigator){
  window.addEventListener("load", ()=>{
    navigator.serviceWorker.register("./service-worker.js").catch(console.error);
  });
}

// Boot
renderGoals();
