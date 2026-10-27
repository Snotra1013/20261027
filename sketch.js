let walkSprite; // 儲存角色的走路精靈圖
let characterX; // 儲存角色目前的水平位置
let characterY; // 儲存角色目前的垂直位置
let facingDirection = 1; // 設定角色朝向，1 為右方，-1 為左方
const frameCountInSprite = 6; // 設定精靈圖中的動畫格數
const characterScale = 1.8; // 設定角色相對於原始圖片的放大倍率
const movementSpeed = 4; // 設定角色每一影格的移動速度

function preload() { // 在畫布建立前載入角色精靈圖
  walkSprite = loadImage("1/走路/all.png"); // 載入六格橫向走路精靈圖
} // 結束精靈圖載入函式

function setup() { // 設定全螢幕畫布與角色初始位置
  createCanvas(windowWidth, windowHeight); // 建立符合瀏覽器視窗大小的畫布
  imageMode(CENTER); // 讓精靈圖以指定位置作為繪製中心
  characterX = width / 2; // 將角色初始水平位置放在畫面中央
  characterY = height / 2; // 將角色初始垂直位置放在畫面中央
} // 結束畫布初始化函式

function draw() { // 每一影格更新畫面與角色狀態
  background("#FEFAE0"); // 使用指定的淡黃色作為畫布背景
  let isMoving = false; // 記錄角色本影格是否正在移動
  if (keyIsDown(LEFT_ARROW)) { // 檢查左方向鍵是否正被按住
    characterX -= movementSpeed; // 持續將角色向左移動
    facingDirection = -1; // 將角色朝向設定為左方
    isMoving = true; // 標記角色正在移動
  } // 結束左方向鍵的處理
  if (keyIsDown(RIGHT_ARROW)) { // 檢查右方向鍵是否正被按住
    characterX += movementSpeed; // 持續將角色向右移動
    facingDirection = 1; // 將角色朝向設定為右方
    isMoving = true; // 標記角色正在移動
  } // 結束右方向鍵的處理
  let frameWidth = walkSprite.width / frameCountInSprite; // 計算精靈圖中單格的來源寬度
  let characterWidth = frameWidth * characterScale; // 計算角色顯示時的寬度
  let characterHeight = walkSprite.height * characterScale; // 計算角色顯示時的高度
  characterX = constrain(characterX, characterWidth / 2, width - characterWidth / 2); // 限制角色不會移出畫布左右邊界
  let frameIndex = isMoving ? floor(millis() / 100) % frameCountInSprite : 0; // 移動時循環播放六格動畫，停止時顯示第一格
  push(); // 暫存畫布的座標與縮放狀態
  translate(characterX, characterY); // 將繪圖原點移至角色目前位置
  scale(facingDirection, 1); // 依角色方向決定是否水平翻轉精靈圖
  image(walkSprite, 0, 0, characterWidth, characterHeight, frameIndex * frameWidth, 0, frameWidth, walkSprite.height); // 繪製目前動畫格
  pop(); // 還原畫布的座標與縮放狀態
} // 結束畫面更新函式

function windowResized() { // 當瀏覽器視窗尺寸改變時重新調整畫布
  resizeCanvas(windowWidth, windowHeight); // 將畫布調整為最新的視窗大小
  characterY = height / 2; // 讓角色在視窗縮放後維持垂直置中
  characterX = constrain(characterX, 0, width); // 確保角色水平位置仍在新畫布範圍內
} // 結束視窗尺寸調整函式
