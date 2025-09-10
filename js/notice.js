// Notice Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initNoticeSystem();
});

function initNoticeSystem() {
    // Initialize all components
    initAdminPanel();
    initImageUpload();
    initNoticeGallery();
    initModal();
    initSearch();
    initViewToggle();
    
    // Load existing notices
    loadNotices();
}

// Admin Panel Management
function initAdminPanel() {
    const adminToggle = document.getElementById('adminToggle');
    const adminContent = document.getElementById('adminContent');
    
    if (adminToggle && adminContent) {
        adminToggle.addEventListener('click', function() {
            const isActive = adminContent.classList.contains('active');
            
            if (isActive) {
                adminContent.classList.remove('active');
                adminToggle.innerHTML = '<i class="fas fa-key"></i> 관리자 모드';
            } else {
                adminContent.classList.add('active');
                adminToggle.innerHTML = '<i class="fas fa-times"></i> 닫기';
            }
        });
    }
    
    // Form submission
    const noticeForm = document.getElementById('noticeForm');
    if (noticeForm) {
        noticeForm.addEventListener('submit', handleNoticeSubmit);
    }
    
    // Clear form
    const clearForm = document.getElementById('clearForm');
    if (clearForm) {
        clearForm.addEventListener('click', clearNoticeForm);
    }
}

// Image Upload System
function initImageUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    
    if (!uploadArea || !imageUpload || !imagePreview) return;
    
    // Click to upload
    uploadArea.addEventListener('click', () => imageUpload.click());
    
    // File input change
    imageUpload.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
}

function processFiles(files) {
    const imagePreview = document.getElementById('imagePreview');
    const validFiles = files.filter(file => {
        const isImage = file.type.startsWith('image/');
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
        
        if (!isImage) {
            showNotification('이미지 파일만 업로드 가능합니다.', 'error');
            return false;
        }
        
        if (!isValidSize) {
            showNotification('파일 크기는 5MB 이하여야 합니다.', 'error');
            return false;
        }
        
        return true;
    });
    
    validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            createPreviewItem(e.target.result, file.name);
        };
        reader.readAsDataURL(file);
    });
}

function createPreviewItem(src, fileName) {
    const imagePreview = document.getElementById('imagePreview');
    const previewItem = document.createElement('div');
    previewItem.className = 'preview-item';
    previewItem.innerHTML = `
        <img src="${src}" alt="${fileName}" class="preview-image">
        <button type="button" class="preview-remove" onclick="removePreviewItem(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    imagePreview.appendChild(previewItem);
}

function removePreviewItem(button) {
    button.parentElement.remove();
}

// Notice Form Handling
function handleNoticeSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('noticeTitle').value.trim();
    const description = document.getElementById('noticeDescription').value.trim();
    const previewItems = document.querySelectorAll('.preview-item img');
    
    if (!title) {
        showNotification('제목을 입력해주세요.', 'error');
        return;
    }
    
    if (previewItems.length === 0) {
        showNotification('최소 하나의 이미지를 업로드해주세요.', 'error');
        return;
    }
    
    // Create notice object
    const notice = {
        id: Date.now(),
        title: title,
        description: description,
        images: Array.from(previewItems).map(img => ({
            src: img.src,
            alt: img.alt
        })),
        date: new Date().toLocaleDateString('ko-KR'),
        timestamp: Date.now()
    };
    
    // Save notice
    saveNotice(notice);
    
    // Clear form
    clearNoticeForm();
    
    // Reload notices
    loadNotices();
    
    showNotification('공지사항이 성공적으로 추가되었습니다.', 'success');
}

function clearNoticeForm() {
    document.getElementById('noticeTitle').value = '';
    document.getElementById('noticeDescription').value = '';
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('imageUpload').value = '';
}

// Notice Storage
function saveNotice(notice) {
    const notices = getNotices();
    notices.unshift(notice); // Add to beginning
    localStorage.setItem('kodevidecamp_notices', JSON.stringify(notices));
}

function getNotices() {
    const stored = localStorage.getItem('kodevidecamp_notices');
    return stored ? JSON.parse(stored) : getDefaultNotices();
}

function getDefaultNotices() {
    return [
        {
            id: 1,
            title: 'KodeVideCamp 웹사이트 오픈!',
            description: 'KodeVideCamp 공식 웹사이트가 오픈되었습니다. 앞으로 다양한 코딩 교육 콘텐츠를 제공할 예정입니다.',
            images: [{
                src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNjY3ZWVhO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM3NjRiYTI7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNncmFkaWVudCkiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjEyMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+CiAgICA8dHNwYW4geD0iMjAwIiBkeT0iMCI+S29kZVZpZGVvQ2FtcDwvdHNwYW4+CiAgICA8dHNwYW4geD0iMjAwIiBkeT0iNDAiPldlYnNpdGUgT3BlbiE8L3RzcGFuPgogIDwvdGV4dD4KICA8Y2lyY2xlIGN4PSIyMDAiIGN5PSIyMDAiIHI9IjMwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMykiLz4KICA8cG9seWdvbiBwb2ludHM9IjE5MCwyMDAgMjEwLDIwMCAyMDAsMTgwIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=',
                alt: 'KodeVideCamp 웹사이트 오픈'
            }],
            date: '2025-01-10',
            timestamp: Date.now() - 86400000
        },
        {
            id: 2,
            title: '새로운 강의 시리즈 출시 예정',
            description: 'React, Vue.js, Node.js를 다루는 새로운 강의 시리즈가 곧 출시됩니다. 많은 관심 부탁드립니다!',
            images: [{
                src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I2YwOTNmYjtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNjY3ZWVhO3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjZ3JhZGllbnQyKSIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTIwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4KICAgIDx0c3BhbiB4PSIyMDAiIGR5PSIwIj5OZXcgQ291cnNlczwvdHNwYW4+CiAgICA8dHNwYW4geD0iMjAwIiBkeT0iMzAiPlJlYWN0ICYgVnVlLmpzPC90c3Bhbj4KICAgIDx0c3BhbiB4PSIyMDAiIGR5PSIzMCI+Tm9kZS5qczwvdHNwYW4+CiAgPC90ZXh0PgogIDxyZWN0IHg9IjE3MCIgeT0iMTkwIiB3aWR0aD0iNjAiIGhlaWdodD0iNDAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4zKSIgcng9IjUiLz4KICA8cG9seWdvbiBwb2ludHM9IjE5MCwyMDAgMjEwLDIxMCAxOTAsMjIwIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=',
                alt: '새로운 강의 시리즈'
            }],
            date: '2025-01-08',
            timestamp: Date.now() - 172800000
        }
    ];
}

function deleteNotice(id) {
    const notices = getNotices();
    const filteredNotices = notices.filter(notice => notice.id !== id);
    localStorage.setItem('kodevidecamp_notices', JSON.stringify(filteredNotices));
    loadNotices();
    closeModal();
    showNotification('공지사항이 삭제되었습니다.', 'success');
}

// Notice Gallery
function initNoticeGallery() {
    const noticeGrid = document.getElementById('noticeGrid');
    if (!noticeGrid) return;
    
    // Add click event delegation
    noticeGrid.addEventListener('click', function(e) {
        const noticeCard = e.target.closest('.notice-card');
        if (noticeCard) {
            const noticeId = parseInt(noticeCard.dataset.id);
            openNoticeModal(noticeId);
        }
    });
}

function loadNotices() {
    const notices = getNotices();
    const noticeGrid = document.getElementById('noticeGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!noticeGrid || !emptyState) return;
    
    if (notices.length === 0) {
        noticeGrid.innerHTML = '';
        emptyState.classList.add('show');
        return;
    }
    
    emptyState.classList.remove('show');
    
    noticeGrid.innerHTML = notices.map(notice => `
        <div class="notice-card" data-id="${notice.id}">
            <img src="${notice.images[0].src}" alt="${notice.images[0].alt}" class="notice-image">
            <div class="notice-content">
                <h3 class="notice-title">${notice.title}</h3>
                <p class="notice-description">${notice.description}</p>
                <div class="notice-meta">
                    <div class="notice-date">
                        <i class="fas fa-calendar"></i>
                        ${notice.date}
                    </div>
                    <div class="notice-actions">
                        <button class="action-btn" title="자세히 보기">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Modal System
function initModal() {
    const modal = document.getElementById('imageModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const deleteNotice = document.getElementById('deleteNotice');
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (deleteNotice) {
        deleteNotice.addEventListener('click', function() {
            const noticeId = parseInt(this.dataset.noticeId);
            if (confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
                deleteNoticeById(noticeId);
            }
        });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openNoticeModal(noticeId) {
    const notices = getNotices();
    const notice = notices.find(n => n.id === noticeId);
    
    if (!notice) return;
    
    const modal = document.getElementById('imageModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');
    const deleteBtn = document.getElementById('deleteNotice');
    
    if (modal && modalTitle && modalDate && modalImage && modalDescription) {
        modalTitle.textContent = notice.title;
        modalDate.textContent = notice.date;
        modalImage.src = notice.images[0].src;
        modalImage.alt = notice.images[0].alt;
        modalDescription.textContent = notice.description;
        
        if (deleteBtn) {
            deleteBtn.dataset.noticeId = noticeId;
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function deleteNoticeById(id) {
    const notices = getNotices();
    const filteredNotices = notices.filter(notice => notice.id !== id);
    localStorage.setItem('kodevidecamp_notices', JSON.stringify(filteredNotices));
    loadNotices();
    closeModal();
    showNotification('공지사항이 삭제되었습니다.', 'success');
}

// Search Functionality
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', KodeVideCamp.debounce(function(e) {
        const query = e.target.value.toLowerCase().trim();
        filterNotices(query);
    }, 300));
}

function filterNotices(query) {
    const notices = getNotices();
    const filteredNotices = query 
        ? notices.filter(notice => 
            notice.title.toLowerCase().includes(query) ||
            notice.description.toLowerCase().includes(query)
          )
        : notices;
    
    displayFilteredNotices(filteredNotices);
}

function displayFilteredNotices(notices) {
    const noticeGrid = document.getElementById('noticeGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!noticeGrid || !emptyState) return;
    
    if (notices.length === 0) {
        noticeGrid.innerHTML = '';
        emptyState.classList.add('show');
        emptyState.querySelector('h3').textContent = '검색 결과가 없습니다';
        emptyState.querySelector('p').textContent = '다른 키워드로 검색해보세요';
        return;
    }
    
    emptyState.classList.remove('show');
    
    noticeGrid.innerHTML = notices.map(notice => `
        <div class="notice-card" data-id="${notice.id}">
            <img src="${notice.images[0].src}" alt="${notice.images[0].alt}" class="notice-image">
            <div class="notice-content">
                <h3 class="notice-title">${notice.title}</h3>
                <p class="notice-description">${notice.description}</p>
                <div class="notice-meta">
                    <div class="notice-date">
                        <i class="fas fa-calendar"></i>
                        ${notice.date}
                    </div>
                    <div class="notice-actions">
                        <button class="action-btn" title="자세히 보기">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// View Toggle
function initViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const noticeGrid = document.getElementById('noticeGrid');
    
    if (!noticeGrid) return;
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            viewBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Toggle grid view
            const view = this.dataset.view;
            if (view === 'list') {
                noticeGrid.classList.add('list-view');
            } else {
                noticeGrid.classList.remove('list-view');
            }
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 15px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => notification.remove());
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return 'linear-gradient(135deg, #4CAF50, #45a049)';
        case 'error': return 'linear-gradient(135deg, #f44336, #da190b)';
        case 'warning': return 'linear-gradient(135deg, #ff9800, #f57c00)';
        default: return 'linear-gradient(135deg, #2196F3, #0b7dda)';
    }
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        border-radius: 3px;
        transition: background 0.3s ease;
    }
    
    .notification-close:hover {
        background: rgba(255,255,255,0.2);
    }
`;
document.head.appendChild(notificationStyles);
