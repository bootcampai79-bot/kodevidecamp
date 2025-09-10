// FAQ Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    try {
        initFAQSystem();
    } catch (error) {
        console.error('Error initializing FAQ system:', error);
        showNotification('시스템 초기화 중 오류가 발생했습니다.', 'error');
    }
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
    try {
        const faqs = getFAQs();
        faqs.unshift(faq); // Add to beginning
        localStorage.setItem('kodevidecamp_faqs', JSON.stringify(faqs));
    } catch (error) {
        console.error('Error saving FAQ:', error);
        showNotification('FAQ 저장 중 오류가 발생했습니다.', 'error');
    }
}

function getFAQs() {
    try {
        const stored = localStorage.getItem('kodevidecamp_faqs');
        return stored ? JSON.parse(stored) : getDefaultFAQs();
    } catch (error) {
        console.error('Error loading FAQs:', error);
        return getDefaultFAQs();
    }
}

function getDefaultFAQs() {
    return [
        {
            id: 1,
            category: 'hackathon',
            priority: 'high',
            question: 'Kode:VideZam 2025 해커톤은 언제 개최되나요?',
            answer: 'Kode:VideZam 2025는 2025년 3월 중 개최 예정입니다. 정확한 일정은 2월 중 공지될 예정이며, 2박 3일 일정으로 진행됩니다. KT 본사 및 주요 사업장에서 동시에 개최되며, 온라인 참여도 가능합니다.',
            tags: ['일정', '3월', '2박3일', '본사'],
            helpful: { yes: 25, no: 1 },
            date: '2025-01-10',
            timestamp: Date.now() - 86400000
        },
        {
            id: 2,
            category: 'hackathon',
            priority: 'high',
            question: '참가 자격이 어떻게 되나요?',
            answer: 'KT 그룹 전 계열사 임직원이면 누구나 참가 가능합니다. 개발 경험이나 기술적 배경이 없어도 괜찮습니다. 기획자, 디자이너, 마케터, 영업 등 다양한 직군의 참여를 환영합니다. 팀 구성 시 다양한 역할이 필요하기 때문입니다.',
            tags: ['KT그룹', '임직원', '모든직군', '경험무관'],
            helpful: { yes: 32, no: 0 },
            date: '2025-01-09',
            timestamp: Date.now() - 172800000
        },
        {
            id: 3,
            category: 'technical',
            priority: 'normal',
            question: '개발 환경이나 장비는 어떻게 준비하나요?',
            answer: '개인 노트북을 지참해주시면 됩니다. 개발에 필요한 소프트웨어는 무료 도구들을 활용하며, 클라우드 크레딧과 API 키 등은 행사 당일 제공됩니다. 추가로 필요한 하드웨어(아두이노, 센서 등)는 현장에서 대여 가능합니다.',
            tags: ['노트북', '개발환경', '클라우드', '하드웨어'],
            helpful: { yes: 18, no: 2 },
            date: '2025-01-08',
            timestamp: Date.now() - 259200000
        },
        {
            id: 4,
            category: 'hackathon',
            priority: 'normal',
            question: '팀은 어떻게 구성하나요?',
            answer: '팀 구성은 자유롭게 하실 수 있습니다. 사전에 팀을 구성해서 참가하거나, 현장에서 팀 매칭을 통해 구성할 수 있습니다. 한 팀당 3-5명으로 구성되며, 다양한 직군이 함께하는 것을 권장합니다. 팀 매칭 세션도 별도로 진행됩니다.',
            tags: ['팀구성', '3-5명', '팀매칭', '다양한직군'],
            helpful: { yes: 28, no: 1 
            date: '2025-01-07',
            timestamp: Date.now() - 345600000
        },
        {
            id: 5,
            category: 'general',
            priority: 'normal',
            question: '시상 내역은 어떻게 되나요?',
            answer: '대상(1팀): 1,000만원 상당의 상금 및 해외 컨퍼런스 참가 기회\n최우수상(2팀): 500만원 상당의 상금\n우수상(3팀): 300만원 상당의 상금\n특별상(5팀): 100만원 상당의 상금\n\n모든 참가자에게는 참가 기념품과 수료증이 제공됩니다.',
            tags: ['시상', '상금', '해외컨퍼런스', '수료증'],
            helpful: { yes: 45, no: 0 },
            date: '2025-01-06',
            timestamp: Date.now() - 432000000
        },
        {
            id: 6,
            category: 'general',
            priority: 'urgent',
            question: '참가 신청은 어떻게 하나요?',
            answer: '참가 신청은 KT 그룹 내부 포털을 통해 진행됩니다. 신청 기간은 2025년 2월 1일부터 2월 28일까지이며, 선착순으로 마감됩니다. 신청 시 간단한 참가 동기와 관심 분야를 작성해주시면 됩니다.\n\n팀으로 신청하는 경우 팀장이 대표로 신청하고, 팀원 정보를 함께 입력해주세요.',
            tags: ['신청방법', '내부포털', '2월신청', '선착순'],
            helpful: { yes: 38, no: 2 },
            date: '2025-01-05',
            timestamp: Date.now() - 518400000
        },
        {
            id: 7,
            category: 'hackathon',
            priority: 'normal',
            question: '어떤 주제로 프로젝트를 진행하나요?',
            answer: 'KT의 미래 성장 동력과 관련된 자유 주제입니다. AI/ML, 5G/6G, 클라우드, IoT, 메타버스, 블록체인, 핀테크 등 다양한 기술 분야를 활용할 수 있습니다. 고객 경험 개선, 업무 효율화, 신규 사업 아이디어 등 KT 비즈니스와 연관된 혁신적인 아이디어를 환영합니다.',
            tags: ['자유주제', 'AI', '5G', '혁신아이디어'],
            helpful: { yes: 22, no: 1 },
            date: '2025-01-04',
            timestamp: Date.now() - 604800000
        },
        {
            id: 8,
            category: 'technical',
            priority: 'normal',
            question: '멘토링 지원이 있나요?',
            answer: '네, 각 분야별 전문가 멘토들이 배치됩니다. KT 내부 기술 전문가들과 외부 산업 전문가들이 멘토로 참여하여 기술적 조언과 비즈니스 관점에서의 피드백을 제공합니다. 멘토링은 수시로 요청할 수 있으며, 정해진 멘토링 타임도 별도로 운영됩니다.',
            tags: ['멘토링', '기술전문가', '비즈니스', '피드백'],
            helpful: { yes: 31, no: 0 },
            date: '2025-01-03',
            timestamp: Date.now() - 691200000
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
        hackathon: '<i class="fas fa-trophy"></i>',
        course: '<i class="fas fa-graduation-cap"></i>',
        payment: '<i class="fas fa-credit-card"></i>',
        technical: '<i class="fas fa-cog"></i>',
        general: '<i class="fas fa-info-circle"></i>'
    };
    return icons[category] || '<i class="fas fa-question"></i>';
}

function getCategoryName(category) {
    const names = {
        hackathon: '해커톤',
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
