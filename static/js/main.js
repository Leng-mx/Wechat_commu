document.addEventListener("DOMContentLoaded", () => {
    const titleName = document.getElementById("titleName");
    const chatNameInput = document.getElementById("chatNameInput");
    const leftAvatarUpload = document.getElementById("leftAvatarUpload");
    const rightAvatarUpload = document.getElementById("rightAvatarUpload");
    const chatBgUpload = document.getElementById("chatBgUpload");
    const chatScreen = document.getElementById("chatScreen");
    const leftMsgInput = document.getElementById("leftMsgInput");
    const rightMsgInput = document.getElementById("rightMsgInput");
    const addLeftMsgBtn = document.getElementById("addLeftMsgBtn");
    const addRightMsgBtn = document.getElementById("addRightMsgBtn");
    const exportBtn = document.getElementById("exportBtn");
    const chatMessageInput = document.getElementById("chatMessage");
  
    // 初始化头像，使用后端传递的默认头像路径
    let leftAvatar = DEFAULT_AVATAR;
    let rightAvatar = DEFAULT_AVATAR;
  
    // 修改顶部对话人名称
    chatNameInput.addEventListener("input", () => {
      titleName.textContent = chatNameInput.value.trim() || "邱";
    });
  
    // 上传左侧头像
    leftAvatarUpload.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;
      processAvatar(file, (resizedImage) => {
        leftAvatar = resizedImage;
      }, '左侧头像上传失败');
    });
  
    // 上传右侧头像
    rightAvatarUpload.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;
      processAvatar(file, (resizedImage) => {
        rightAvatar = resizedImage;
      }, '右侧头像上传失败');
    });
  
    // 上传背景图片
    chatBgUpload.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        alert("请选择有效的图片文件作为背景");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        chatScreen.style.backgroundImage = `url(${e.target.result})`;
      };
      reader.readAsDataURL(file);
    });
  
    // 处理头像尺寸
    function processAvatar(file, callback, errorMessage) {
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        alert("请选择有效的图片文件作为头像");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
  
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const size = 40; // 目标尺寸 40px x 40px
          canvas.width = size;
          canvas.height = size;
  
          // 清除画布
          ctx.clearRect(0, 0, size, size);
          // 绘制缩放后的图片
          ctx.drawImage(img, 0, 0, size, size);
          callback(canvas.toDataURL()); // 返回缩放后的图片
        };
  
        img.onerror = () => {
          alert(errorMessage);
        };
      };
      reader.onerror = () => {
        alert(errorMessage);
      };
      reader.readAsDataURL(file);
    }
  
    // 添加聊天气泡
    function addMessage(side, avatar, message) {
      const bubble = document.createElement("div");
      bubble.className = `chat-bubble ${side}`;
  
      if (side === 'left') {
        bubble.innerHTML = `
          <div class="avatar">
            <img src="${avatar}" alt="Avatar" />
          </div>
          <div class="bubble-content">${escapeHtml(message)}</div>
        `;
      } else if (side === 'right') {
        bubble.innerHTML = `
          <div class="bubble-content">${escapeHtml(message)}</div>
          <div class="avatar">
            <img src="${avatar}" alt="Avatar" />
          </div>
        `;
      }
  
      chatScreen.appendChild(bubble);
      chatScreen.scrollTop = chatScreen.scrollHeight;
    }
  
    // 左侧聊天内容
    addLeftMsgBtn.addEventListener("click", () => {
      const msg = leftMsgInput.value.trim();
      if (!msg) return alert("请输入左侧聊天内容");
      addMessage("left", leftAvatar, msg);
      leftMsgInput.value = "";
    });
  
    // 右侧聊天内容
    addRightMsgBtn.addEventListener("click", () => {
      const msg = rightMsgInput.value.trim();
      if (!msg) return alert("请输入右侧聊天内容");
      addMessage("right", rightAvatar, msg);
      rightMsgInput.value = "";
    });
  
    // 导出聊天截图
    exportBtn.addEventListener("click", () => {
      // 临时隐藏输入区以避免出现在截图中
      const inputArea = document.querySelector(".bottom-input-bar");
      inputArea.style.display = "none";
  
      html2canvas(chatScreen, { useCORS: true }).then((canvas) => {
        const link = document.createElement("a");
        link.download = "chat_screenshot.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
  
        // 恢复输入区显示
        inputArea.style.display = "flex";
      }).catch((error) => {
        console.error("导出聊天截图失败：", error);
        alert("导出聊天截图失败，请重试。");
        // 恢复输入区显示
        inputArea.style.display = "flex";
      });
    });
  
    // 支持回车键发送消息（左侧）
    leftMsgInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addLeftMsgBtn.click();
      }
    });
  
    // 支持回车键发送消息（右侧）
    rightMsgInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addRightMsgBtn.click();
      }
    });
  
    // 支持回车键发送聊天输入区消息（可选功能）
    chatMessageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        // 可以在这里实现发送消息到聊天气泡的功能
        // 目前该输入框未绑定具体功能，根据需求自行扩展
        alert("发送聊天输入区的消息功能尚未实现。");
      }
    });
  
    // 转义HTML特殊字符，防止XSS攻击
    function escapeHtml(text) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
  });
  