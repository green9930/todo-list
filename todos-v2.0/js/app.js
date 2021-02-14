// Global state
let todos = [];

// DOM nodes
// <ul class="todos">
const $todos = document.querySelector('.todos');
const $inputTodo = document.querySelector('.input-todo');
const $completeAll = document.getElementById('ck-complete-all');
const $clearCompleted = document.querySelector('.clear-completed > .btn');
const $completed = document.querySelector('.completed-todos');
const $active = document.querySelector('.active-todos');

// 렌더링하는 함수
/* <li id="1" class="todo-item">
  <input id="ck-1" class="checkbox" type="checkbox">
  <label for="ck-1">HTML</label>
  <i class="remove-todo far fa-times-circle"></i>
</li> */

// render가 호출되는 시점 : todo가 변경되었을 때
const render = () => {
  console.log('[todos]', todos);
  // 문자열로 만들어진 HTML들이 파싱되어 todo에 자식요소로 들어감
  $todos.innerHTML = todos.map(({ id, content, completed }) => `
  <li id="${id}" class="todo-item">
    <input id="ck-${id}" class="checkbox" type="checkbox" ${completed ? 'checked' : ''}>
    <label for="ck-${id}">${content}</label>    
    <i class="remove-todo far fa-times-circle"></i>
  </li>`).join(' ');

  // completed, active todo 개수 표시
  $completed.textContent = todos.filter(todo => todo.completed).length;
  $active.textContent = todos.filter(todo => !todo.completed).length;
  // console.log(countCompleted, countActive);
};

const fetchTodos = () => {
  // TODO: 서버로부터 todos 데이터를 취득한다. (현재 서버가 없으니 임시로..)
  todos = [
    { id: 1, content: 'HTML', completed: true },
    { id: 2, content: 'CSS', completed: true },
    { id: 3, content: 'JavaScript', completed: false },
  ];
  // 자료 sorting (사실 클라이언트가 아니라 서버에서 자료를 sorting해서 넘겨주는 것이 가장 좋음)
  // this를 변경시키면서 변경한 배열을 반환 -> 배열을 복사해서 변경하는 것이 바람직함 (주소값이 바뀌기 때문)
  todos = [...todos].sort((todo1, todo2) => todo2.id - todo1.id);
  // todo가 변경되면 render 호출해야 함
  render();
};

// 현재 todo data 중 가장 큰 id보다 1이 더 큰 정수값을 얻을 수 있음 (굳이 빈 자리에 숫자 끼워넣을 필요 없음)
// todos가 비어있으면 Math.max = -Infinity
// todos.length가 truthy한 값이면 (=0이 아니면) Math.max... 0이면 기본값 1
const generateId = () => (todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1);

const addTodo = content => {
  todos = [{ id: generateId, content, completed: false }, ...todos];
  render();
};

const toggleTodo = id => {
  // id는 숫자여야 한다. -> 숫자가 아니면 에러를 발생시킬 것인가, 문자열을 받아 숫자로 변환시킬 것인가.
  // +id : 문자열로 넘어오면 숫자로 타입변환하기 위해
  // TypeScript의 경우 type을 지정해줌
  todos = todos.map(todo => (todo.id === +id ? { ...todo, completed: !todo.completed } : todo));
  render();
};

const removeTodo = id => {
  // +id : type이 불일치할 수 있으므로
  todos = todos.filter(todo => todo.id !== +id);
  render();
};

// 일괄 toggle
const toggleCompleted = () => {
  todos = todos.map(todo => ({ ...todo, completed: $completeAll.checked }));
  render();
};

document.addEventListener('DOMContentLoaded', fetchTodos);

$inputTodo.onkeyup = e => {
  // 새로운 todo를 todos 배열에 추가해주는 함수 생성 -> content 필요
  const content = $inputTodo.value;
  // console.log($inputTodo.value);

  // 키보드를 누르자마자 정보가 전달되면 안되기 때문에
  // enter키가 눌리지 않았거나 content가 비어있으면 아무것도 하지 않음
  if (e.key !== 'Enter' || !content) return;

  addTodo(content);

  // 내용을 입력하고 enter를 눌렀을 때 $inputTodo 비우기
  // content를 쓰면 원시값이라서 수정이 안됨
  $inputTodo.value = '';
};

$todos.onchange = e => {
  const { id } = e.target.parentNode;
  toggleTodo(id);
};

// x 버튼에서 클릭만 인정되도록 -> 클릭 이벤트는 가장 흔하기 때문에 반드시 걸러줘야 한다.
$todos.onclick = e => {
  // classList 말고 matches를 써도 됨
  if (!e.target.classList.contains('remove-todo')) return;
  // 실무는 depth가 깊어질 수 있기 때문에 console.log로 계속 확인하는 습관 필요
  // console.log(e.target.parentNode.id);

  // 해당 id를 갖고있는 todo를 제거한 배열 반환
  removeTodo(e.target.parentNode.id);
};

// completed 일괄 변경
// 인수가 없으므로 간단하게
$completeAll.onchange = toggleCompleted;

const removeCompletedAll = () => {
  todos = todos.filter(todo => !todo.completed);
  render();
};

$clearCompleted.onclick = removeCompletedAll;
