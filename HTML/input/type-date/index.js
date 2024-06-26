// 获取 UI 元素
const nativePicker = document.querySelector(".nativeDatePicker");
const fallbackPicker = document.querySelector(".fallbackDatePicker");
const fallbackLabel = document.querySelector(".fallbackLabel");

const yearSelect = document.querySelector("#year");
const monthSelect = document.querySelector("#month");
const daySelect = document.querySelector("#day");

// 最初，隐藏回退元素
fallbackPicker.style.display = "none";
fallbackLabel.style.display = "none";

// 测试一个新的 date 输入框是否会回退至 text 输入框
const test = document.createElement("input");

try {
  test.type = "date";
} catch (e) {
  console.log(e.message);
}

// 如果回退了，运行 if 代码块中的代码
if (test.type === "text") {
  // 隐藏原生选择器，显示回退元素
  nativePicker.style.display = "none";
  fallbackPicker.style.display = "block";
  fallbackLabel.style.display = "block";

  // 动态生成天数和年数
  // 由于硬编码的缘故，月份总是相同的
  populateDays(monthSelect.value);
  populateYears();
}

function populateDays(month) {
  // 从当前的 <select> 中删除当前的 <option> 元素集，
  // 为下一个集合的注入做准备。
  while (daySelect.firstChild) {
    daySelect.removeChild(daySelect.firstChild);
  }

  // 创建保存注入新的天数的变量
  let dayNum;

  // 31 天还是 30 天？
  if (
    [
      "January",
      "March",
      "May",
      "July",
      "August",
      "October",
      "December",
    ].includes(month)
  ) {
    dayNum = 31;
  } else if (["April", "June", "September", "November"].includes(month)) {
    dayNum = 30;
  } else {
    // 如果是 2 月，计算其是否为闰年
    const year = yearSelect.value;
    const isLeap = new Date(year, 1, 29).getMonth() === 1;
    dayNum = isLeap ? 29 : 28;
  }

  // 将适当数量的新 <option> 元素注入到当前的 <select> 元素中。
  for (let i = 1; i <= dayNum; i++) {
    const option = document.createElement("option");
    option.textContent = i;
    daySelect.appendChild(option);
  }

  // 如果之前的天数已经设定，将 daySelect 的值设置为那一天，以防止当年数改变时天数被重置为1
  if (previousDay) {
    daySelect.value = previousDay;

    // 如果前一天被设定为一个较高的数字，例如31，然后你选择了一个总天数较少的月份（例如2月），
    // 这部分代码就会确保可用的最大日期被选中，而不是显示一个空白的 daySelect
    if (daySelect.value === "") {
      daySelect.value = previousDay - 1;
    }

    if (daySelect.value === "") {
      daySelect.value = previousDay - 2;
    }

    if (daySelect.value === "") {
      daySelect.value = previousDay - 3;
    }
  }
}

function populateYears() {
  // 获取今年的年份数字
  const date = new Date();
  const year = date.getFullYear();

  // 使今年以及之前的 100 年都能在 <select> 中选取。
  for (let i = 0; i <= 100; i++) {
    const option = document.createElement("option");
    option.textContent = year - i;
    yearSelect.appendChild(option);
  }
}

// 当月或年的 <select> 值改变时，重新运行 populateDays()
// 使得该变化影响到可用的天数
yearSelect.onchange = () => {
  populateDays(monthSelect.value);
};

monthSelect.onchange = () => {
  populateDays(monthSelect.value);
};

// 保留选择的天数
let previousDay;

// 更新之前设定的日期
// 用法请查看 populateDays() 的结尾
daySelect.onchange = () => {
  previousDay = daySelect.value;
};
