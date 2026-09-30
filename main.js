// API の URL と、画像パスの先頭に付けるドメイン
const API_BASE_URL = 'https://ihatov08.github.io/kimetsu_api/api';
const IMAGE_BASE_URL = 'https://ihatov08.github.io';

const characterList = document.getElementById('character-list');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error');

// 指定した種類（all / kisatsutai / hashira / oni）のキャラクターを API から取得する
async function fetchCharacters(type) {
  const response = await fetch(`${API_BASE_URL}/${type}.json`);

  // 404 や 500 などの HTTP エラーでも fetch 自体は失敗しないので、自分で確認してエラーにする
  if (!response.ok) {
    throw new Error(`HTTPエラー: ${response.status}`);
  }

  const characters = await response.json();
  return characters;
}

// キャラクターの配列を受け取り、一覧として画面に表示する
function renderCharacters(characters) {
  // 前の表示を消してから描画する
  characterList.innerHTML = '';

  characters.forEach((character) => {
    const item = document.createElement('li');

    const image = document.createElement('img');
    image.src = IMAGE_BASE_URL + character.image;
    image.alt = character.name;

    const name = document.createElement('p');
    name.textContent = character.name;

    const category = document.createElement('p');
    category.textContent = character.category;

    item.append(image, name, category);
    characterList.append(item);
  });
}

// 指定した種類のキャラクターを取得して表示する
async function showCharacters(type) {
  // 前の表示とエラーメッセージを消して、ローディングを出す
  characterList.innerHTML = '';
  errorMessage.hidden = true;
  loading.hidden = false;

  try {
    const characters = await fetchCharacters(type);
    renderCharacters(characters);
  } catch (error) {
    console.error(error);
    errorMessage.textContent = 'キャラクターの取得に失敗しました。時間をおいて再度お試しください。';
    errorMessage.hidden = false;
  } finally {
    // 成功しても失敗しても、ローディングは必ず消す
    loading.hidden = true;
  }
}

// ラジオボタンの選択が変わったら、選ばれた種類のキャラクターを表示する
const radioButtons = document.querySelectorAll('input[name="category"]');

radioButtons.forEach((radioButton) => {
  radioButton.addEventListener('change', (event) => {
    showCharacters(event.target.value);
  });
});

// ページを開いたら、まず全キャラクターを表示する
showCharacters('all');
