let walkSprite; // 儲存角色的走路精靈圖
let flipSprite; // 儲存角色的空中轉一圈精靈圖
let punchSprite; // 儲存角色的揮拳精靈圖
let idleSprite; // 儲存角色的待機精靈圖
let characterX; // 儲存角色目前的水平位置
let characterY; // 儲存角色目前的垂直位置
let facingDirection = 1; // 設定角色朝向，1 為右方，-1 為左方
let isDoingFlip = false; // 記錄角色是否正在播放空翻動作
let isFlipKeyHeld = false; // 記錄上方向鍵是否仍被按住
let flipStartTime = 0; // 記錄空翻動畫開始播放的時間
let isDoingPunch = false; // 記錄角色是否正在播放揮拳動作
let isPunchKeyHeld = false; // 記錄空白鍵是否仍被按住
let punchStartTime = 0; // 記錄揮拳動畫開始播放的時間
const walkFrameCount = 6; // 設定走路精靈圖中的動畫格數
const flipFrameCount = 10; // 設定空翻精靈圖中的動畫格數
const punchFrameCount = 10; // 設定揮拳精靈圖中的動畫格數
const flipFrameDuration = 100; // 設定空翻動畫每一格播放的毫秒數
const punchFrameDuration = 100; // 設定揮拳動畫每一格播放的毫秒數
const characterScale = 1.8; // 設定角色相對於原始圖片的放大倍率
const movementSpeed = 4; // 設定角色每一影格的移動速度

function preload() { // 在畫布建立前載入角色精靈圖
  walkSprite = loadImage("1/走路/all.png"); // 載入六格橫向走路精靈圖
  flipSprite = loadImage("1/空中轉一圈/all.png"); // 載入十格橫向空翻精靈圖
  punchSprite = loadImage("1/揮拳/all.png"); // 載入十格橫向揮拳精靈圖
  idleSprite = loadImage("1/待機/MC_MarisaKirisame.png"); // 載入單張待機角色圖片
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
  let flipElapsed = millis() - flipStartTime; // 計算空翻動畫已播放的時間
  if (isDoingFlip && flipElapsed >= flipFrameCount * flipFrameDuration) { // 檢查空翻動畫是否已播放完畢
    isDoingFlip = false; // 結束空翻並返回一般角色動畫
  } // 結束空翻動畫播放完畢的處理
  let punchElapsed = millis() - punchStartTime; // 計算揮拳動畫已播放的時間
  if (isDoingPunch && punchElapsed >= punchFrameCount * punchFrameDuration) { // 檢查揮拳動畫是否已播放完畢
    isDoingPunch = false; // 結束揮拳並返回一般角色動畫
  } // 結束揮拳動畫播放完畢的處理
  let walkFrameWidth = walkSprite.width / walkFrameCount; // 計算走路精靈圖中單格的來源寬度
  let flipFrameWidth = flipSprite.width / flipFrameCount; // 計算空翻精靈圖中單格的來源寬度
  let punchFrameWidth = punchSprite.width / punchFrameCount; // 計算揮拳精靈圖中單格的來源寬度
  let activeSprite = isDoingPunch ? punchSprite : isDoingFlip ? flipSprite : isMoving ? walkSprite : idleSprite; // 依目前動作選擇要繪製的精靈圖
  let activeFrameWidth = isDoingPunch ? punchFrameWidth : isDoingFlip ? flipFrameWidth : isMoving ? walkFrameWidth : idleSprite.width; // 依目前動作選擇動畫單格寬度
  let activeFrameIndex = isDoingPunch ? floor(punchElapsed / punchFrameDuration) : isDoingFlip ? floor(flipElapsed / flipFrameDuration) : isMoving ? floor(millis() / 100) % walkFrameCount : 0; // 依動作狀態計算目前動畫格
  let characterWidth = activeFrameWidth * characterScale; // 計算角色顯示時的寬度
  let characterHeight = activeSprite.height * characterScale; // 計算角色顯示時的高度
  characterX = constrain(characterX, characterWidth / 2, width - characterWidth / 2); // 限制角色不會移出畫布左右邊界
  push(); // 暫存畫布的座標與縮放狀態
  translate(characterX, characterY); // 將繪圖原點移至角色目前位置
  scale(facingDirection, 1); // 依角色方向決定是否水平翻轉精靈圖
  image(activeSprite, 0, 0, characterWidth, characterHeight, activeFrameIndex * activeFrameWidth, 0, activeFrameWidth, activeSprite.height); // 繪製目前動畫格
  pop(); // 還原畫布的座標與縮放狀態
} // 結束畫面更新函式

function keyPressed() { // 處理鍵盤按下事件
  if (keyCode === UP_ARROW && !isFlipKeyHeld) { // 確認上方向鍵剛被按下而非持續按住
    isFlipKeyHeld = true; // 標記上方向鍵目前處於按住狀態
    isDoingFlip = true; // 啟動角色空翻動畫
    flipStartTime = millis(); // 記錄空翻動畫的起始時間
    return false; // 阻止瀏覽器執行上方向鍵的預設捲動行為
  } // 結束上方向鍵觸發處理
  if (keyCode === 32 && !isPunchKeyHeld) { // 確認空白鍵剛被按下而非持續按住
    isPunchKeyHeld = true; // 標記空白鍵目前處於按住狀態
    isDoingPunch = true; // 啟動角色揮拳動畫
    punchStartTime = millis(); // 記錄揮拳動畫的起始時間
    return false; // 阻止空白鍵執行瀏覽器預設的頁面捲動
  } // 結束空白鍵觸發處理
} // 結束鍵盤按下事件函式

function keyReleased() { // 處理鍵盤放開事件
  if (keyCode === UP_ARROW) { // 確認放開的是上方向鍵
    isFlipKeyHeld = false; // 允許下一次按鍵重新觸發空翻
  } // 結束上方向鍵放開處理
  if (keyCode === 32) { // 確認放開的是空白鍵
    isPunchKeyHeld = false; // 允許下一次按鍵重新觸發揮拳
  } // 結束空白鍵放開處理
} // 結束鍵盤放開事件函式

function windowResized() { // 當瀏覽器視窗尺寸改變時重新調整畫布
  resizeCanvas(windowWidth, windowHeight); // 將畫布調整為最新的視窗大小
  characterY = height / 2; // 讓角色在視窗縮放後維持垂直置中
  characterX = constrain(characterX, 0, width); // 確保角色水平位置仍在新畫布範圍內
} // 結束視窗尺寸調整函式
