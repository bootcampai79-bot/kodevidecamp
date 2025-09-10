// FAQ Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initFAQSystem();
});

function initFAQSystem() {
    // Initialize all components
    initAdminPanel();
    initSearch();
    initCategoryFilter();
    initFAQList();
    
    // Load existing FAQs
    loadFAQs();
    updateStats();
}

// Admin Panel Management
function initAdminPanel() {
    const adminToggle = document.getElementById('faqAdminToggle');
    const adminContent = document.getElementById('faqAdminContent');
    
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
    const faqForm = document.getElementById('faqForm');
    if (faqForm) {
        faqForm.addEventListener('submit', handleFAQSubmit);
    }
    
    // Clear form
    const clearForm = document.getElementById('clearFaqForm');
    if (clearForm) {
        clearForm.addEventListener('click', clearFAQForm);
    }
}

// FAQ Form Handling
function handleFAQSubmit(e) {
    e.preventDefault();
    
    const category = document.getElementById('faqCategory').value;
    const priority = document.getElementById('faqPriority').value;
    const question = document.getElementById('faqQuestion').value.trim();
    const answer = document.getElementById('faqAnswer').value.trim();
    const tags = document.getElementById('faqTags').value.trim();
    
    if (!category || !question || !answer) {
        showNotification('모든 필수 항목을 입력해주세요.', 'error');
        return;
    }
    
    // Create FAQ object
    const faq = {
        id: Date.now(),
        category: category,
        priority: priority,
        question: question,
        answer: answer,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        helpful: { yes: 0, no: 0 },
        date: new Date().toLocaleDateString('ko-KR'),
        timestamp: Date.now()
    };
    
    // Save FAQ
    saveFAQ(faq);
    
    // Clear form
    clearFAQForm();
    
    // Reload FAQs
    loadFAQs();
    updateStats();
    
    showNotification('FAQ가 성공적으로 추가되었습니다.', 'success');
}

function clearFAQForm() {
    document.getElementById('faqCategory').value = '';
    document.getElementById('faqPriority').value = 'normal';
    document.getElementById('faqQuestion').value = '';
    document.getElementById('faqAnswer').value = '';
    document.getElementById('faqTags').value = '';
}

// FAQ Storage
function saveFAQ(faq) {
    const faqs = getFAQs();
    faqs.unshift(faq); // Add to beginning
    localStorage.setItem('kodevidecamp_faqs', JSON.stringify(faqs));
}

function getFAQs() {
    const stored = localStorage.getItem('kodevidecamp_faqs');
    return stored ? JSON.parse(stored) : getDefaultFAQs();
}

function getDefaultFAQs() {
    return [
        {
            id: 1,
            category: 'course',
            priority: 'high',
            question: 'KodeVideoCamp의 강의는 어떤 방식으로 진행되나요?',
            answer: 'KodeVideoCamp의 강의는 온라인 동영상 강의로 진행됩니다. 언제 어디서나 원하는 시간에 학습할 수 있으며, 실습 위주의 프로젝트 기반 학습을 통해 실무 능력을 기를 수 있습니다. 각 강의마다 과제와 프로젝트가 제공되며, 강사와의 1:1 피드백도 받을 수 있습니다.',
            tags: ['강의방식', '온라인', '동영상', '실습'],
            helpful: { yes: 15, no: 2 },
            date: '2025-01-10',
            timestamp: Date.now() - 86400000
        },
        {
            id: 2,
            category: 'payment',
            priority: 'high',
            question: '수강료 결제는 어떻게 하나요?',
            answer: '수강료는 신용카드, 계좌이체, 카카오페이 등 다양한 방법으로 결제 가능합니다. 일시불과 할부 결제 모두 지원하며, 학생 할인 혜택도 제공합니다. 결제 후 즉시 강의 수강이 가능합니다.',
            tags: ['결제', '수강료', '신용카드', '할부'],
            helpful: { yes: 12, no: 1 },
            date: '2025-01-09',
            timestamp: Date.now() - 172800000
        },
        {
            id: 3,
            category: 'technical',
            priority: 'normal',
            question: '강의 시청에 필요한 시스템 요구사항이 있나요?',
            answer: '기본적으로 인터넷 연결이 가능한 컴퓨터나 모바일 기기면 충분합니다. 권장 사양은 다음과 같습니다:\n\n• 운영체제: Windows 10 이상, macOS 10.14 이상, 또는 최신 Linux\n• 브라우저: Chrome, Firefox, Safari, Edge 최신 버전\n• 인터넷: 5Mbps 이상의 안정적인 연결\n• 코딩 실습을 위한 텍스트 에디터 (VS Code 권장)',
            tags: ['시스템요구사항', '브라우저', '인터넷', '에디터'],
            helpful: { yes: 8, no: 0 },
            date: '2025-01-08',
            timestamp: Date.now() - 259200000
        },
        {
            id: 4,
            category: 'course',
            priority: 'normal',
            question: '완전 초보자도 수강할 수 있나요?',
            answer: '네, 물론입니다! KodeVideCamp는 완전 초보자를 위한 기초 과정부터 고급 과정까지 체계적으로 구성되어 있습니다. 프로그래밍 경험이 전혀 없어도 차근차근 따라할 수 있도록 설계되었으며, 기초 개념부터 실무 프로젝트까지 단계별로 학습할 수 있습니다.',
            tags: ['초보자', '기초과정', '입문', '단계별'],
            helpful: { yes: 20, no: 1 },
            date: '2025-01-07',
            timestamp: Date.now() - 345600000
        },
        {
            id: 5,
            category: 'general',
            priority: 'normal',
            question: '수료증은 발급되나요?',
            answer: '네, 강의를 완주하시면 수료증을 발급해드립니다. 수료증은 PDF 형태로 제공되며, 이력서나 포트폴리오에 활용하실 수 있습니다. 수료 조건은 전체 강의의 80% 이상 수강과 최종 프로젝트 제출입니다.',
            tags: ['수료증', 'PDF', '이력서', '포트폴리오'],
            helpful: { yes: 10, no: 0 },
            date: '2025-01-06',
            timestamp: Date.now() - 432000000
        },
        {
            id: 6,
            category: 'payment',
            priority: 'urgent',
            question: '환불 정책은 어떻게 되나요?',
            answer: '수강 시작 후 7일 이내에는 100% 환불이 가능합니다. 7일 이후에는 수강 진도에 따라 차등 환불됩니다:\n\n• 30% 미만 수강: 70% 환불\n• 30-50% 수강: 50% 환불\n• 50% 이상 수강: 환불 불가\n\n환불 신청은 고객센터를 통해 접수하실 수 있으며, 영업일 기준 3-5일 내에 처리됩니다.',
            tags: ['환불', '정책', '7일', '차등환불'],
            helpful: { yes: 18, no: 3 },
            date: '2025-01-05',
            timestamp: Date.now() - 518400000
        }
    ];
}

function deleteFAQ(id) {
    const faqs = getFAQs();
    const filteredFAQs = faqs.filter(faq => faq.id !== id);
    localStorage.setItem('kodevidecamp_faqs', JSON.stringify(filteredFAQs));
    loadFAQs();
    updateStats();
    showNotification('FAQ가 삭제되었습니다.', 'success');
}

// Search Functionality
function initSearch() {
    const searchInput = document.getElementById('faqSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', KodeVideCamp.debounce(function(e) {
        const query = e.target.value.toLowerCase().trim();
        filterFAQs();
    }, 300));
}

// Category Filter
function initCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter FAQs
            filterFAQs();
        });
    });
}

function filterFAQs() {
    const searchQuery = document.getElementById('faqSearch').value.toLowerCase().trim();
    const activeCategory = document.querySelector('.category-btn.active').dataset.category;
    
    const faqs = getFAQs();
    let filteredFAQs = faqs;
    
    // Filter by category
    if (activeCategory !== 'all') {
        filteredFAQs = filteredFAQs.filter(faq => faq.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
        filteredFAQs = filteredFAQs.filter(faq => 
            faq.question.toLowerCase().includes(searchQuery) ||
            faq.answer.toLowerCase().includes(searchQuery) ||
            faq.tags.some(tag => tag.toLowerCase().includes(searchQuery))
        );
    }
    
    displayFAQs(filteredFAQs);
    updateStats(filteredFAQs.length);
}

// FAQ List Management
function initFAQList() {
    const faqList = document.getElementById('faqList');
    if (!faqList) return;
    
    // Add click event delegation
    faqList.addEventListener('click', function(e) {
        // Handle FAQ toggle
        if (e.target.closest('.faq-question')) {
            const faqItem = e.target.closest('.faq-item');
            toggleFAQ(faqItem);
        }
        
        // Handle helpful buttons
        if (e.target.closest('.helpful-btn')) {
            const btn = e.target.closest('.helpful-btn');
            const faqId = parseInt(btn.closest('.faq-item').dataset.id);
            const isHelpful = btn.classList.contains('yes');
            markHelpful(faqId, isHelpful);
        }
        
        // Handle admin actions
        if (e.target.closest('.admin-btn')) {
            const btn = e.target.closest('.admin-btn');
            const faqId = parseInt(btn.closest('.faq-item').dataset.id);
            
            if (btn.classList.contains('delete')) {
                if (confirm('정말로 이 FAQ를 삭제하시겠습니까?')) {
                    deleteFAQ(faqId);
                }
            }
        }
    });
}

function toggleFAQ(faqItem) {
    const question = faqItem.querySelector('.faq-question');
    const answer = faqItem.querySelector('.faq-answer');
    const toggle = faqItem.querySelector('.question-toggle');
    
    const isActive = answer.classList.contains('active');
    
    if (isActive) {
        answer.classList.remove('active');
        question.classList.remove('active');
        toggle.classList.remove('active');
    } else {
        answer.classList.add('active');
        question.classList.add('active');
        toggle.classList.add('active');
    }
}

function loadFAQs() {
    const faqs = getFAQs();
    displayFAQs(faqs);
}

function displayFAQs(faqs) {
    const faqList = document.getElementById('faqList');
    const emptyState = document.getElementById('faqEmptyState');
    
    if (!faqList || !emptyState) return;
    
    if (faqs.length === 0) {
        faqList.innerHTML = '';
        emptyState.classList.add('show');
        return;
    }
    
    emptyState.classList.remove('show');
    
    faqList.innerHTML = faqs.map(faq => `
        <div class="faq-item priority-${faq.priority}" data-id="${faq.id}">
            <div class="faq-question">
                <div class="question-content">
                    <h3 class="question-title">${faq.question}</h3>
                    <div class="question-meta">
                        <span class="category-badge ${faq.category}">
                            ${getCategoryIcon(faq.category)}
                            ${getCategoryName(faq.category)}
                        </span>
                        ${faq.tags.length > 0 ? `
                            <div class="question-tags">
                                ${faq.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
                <button class="question-toggle">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            <div class="faq-answer">
                <div class="answer-content">${formatAnswer(faq.answer)}</div>
                <div class="answer-actions">
                    <div class="helpful-section">
                        <span class="helpful-text">이 답변이 도움이 되었나요?</span>
                        <div class="helpful-buttons">
                            <button class="helpful-btn yes ${faq.helpful.yes > 0 ? 'active' : ''}">
                                <i class="fas fa-thumbs-up"></i>
                                도움됨 (${faq.helpful.yes})
                            </button>
                            <button class="helpful-btn no ${faq.helpful.no > 0 ? 'active' : ''}">
                                <i class="fas fa-thumbs-down"></i>
                                아니오 (${faq.helpful.no})
                            </button>
                        </div>
                    </div>
                    <div class="admin-actions">
                        <button class="admin-btn edit" title="수정">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="admin-btn delete" title="삭제">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function formatAnswer(answer) {
    // Convert line breaks to HTML
    return answer.replace(/\n/g, '<br>');
}

function getCategoryIcon(category) {
    const icons = {
        course: '<i class="fas fa-graduation-cap"></i>',
        payment: '<i class="fas fa-credit-card"></i>',
        technical: '<i class="fas fa-cog"></i>',
        general: '<i class="fas fa-info-circle"></i>'
    };
    return icons[category] || '<i class="fas fa-question"></i>';
}

function getCategoryName(category) {
    const names = {
        course: '강의',
        payment: '결제',
        technical: '기술',
        general: '일반'
    };
    return names[category] || '기타';
}

function markHelpful(faqId, isHelpful) {
    const faqs = getFAQs();
    const faq = faqs.find(f => f.id === faqId);
    
    if (!faq) return;
    
    if (isHelpful) {
        faq.helpful.yes++;
    } else {
        faq.helpful.no++;
    }
    
    localStorage.setItem('kodevidecamp_faqs', JSON.stringify(faqs));
    
    // Update display
    const currentCategory = document.querySelector('.category-btn.active').dataset.category;
    filterFAQs();
    
    showNotification('피드백이 등록되었습니다.', 'success');
}

// Statistics
function updateStats(visibleCount = null) {
    const totalFaqs = getFAQs().length;
    const visible = visibleCount !== null ? visibleCount : totalFaqs;
    
    const totalElement = document.getElementById('totalFaqs');
    const visibleElement = document.getElementById('visibleFaqs');
    
    if (totalElement) totalElement.textContent = totalFaqs;
    if (visibleElement) visibleElement.textContent = visible;
}

// Notification System (reuse from notice.js)
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

// Add CSS for notifications if not already added
if (!document.querySelector('#faq-notification-styles')) {
    const notificationStyles = document.createElement('style');
    notificationStyles.id = 'faq-notification-styles';
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
}
