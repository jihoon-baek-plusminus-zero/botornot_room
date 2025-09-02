// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('Bot or Not Room 앱이 로드되었습니다.');
    
    // 버튼 요소들 가져오기
    const oneToOneBtn = document.getElementById('oneToOneBtn');
    const oneToManyBtn = document.getElementById('oneToManyBtn');
    
    // 1:1 접속 버튼 클릭 이벤트
    oneToOneBtn.addEventListener('click', function() {
        console.log('1:1 접속 버튼이 클릭되었습니다.');
        // TODO: 1:1 접속 기능 구현 예정
        showComingSoon('1:1 접속');
    });
    
    // 1:N 접속 버튼 클릭 이벤트
    oneToManyBtn.addEventListener('click', function() {
        console.log('1:N 접속 버튼이 클릭되었습니다.');
        // TODO: 1:N 접속 기능 구현 예정
        showComingSoon('1:N 접속');
    });
    
    // 버튼 호버 효과 강화
    addButtonHoverEffects();
});

/**
 * 개발 중인 기능임을 알리는 메시지 표시
 * @param {string} featureName - 기능 이름
 */
function showComingSoon(featureName) {
    // 간단한 알림 메시지 표시
    const message = `${featureName} 기능은 현재 개발 중입니다.`;
    
    // 브라우저 기본 알림 사용
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Bot or Not Room', { body: message });
    } else {
        // 폴백: alert 사용
        alert(message);
    }
}

/**
 * 버튼에 추가적인 호버 효과 적용
 */
function addButtonHoverEffects() {
    const buttons = document.querySelectorAll('.connection-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-2px) scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
    });
}

/**
 * 페이지 로드 성능 모니터링
 */
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`페이지 로드 완료: ${loadTime.toFixed(2)}ms`);
});

/**
 * 에러 핸들링
 */
window.addEventListener('error', function(e) {
    console.error('페이지 에러 발생:', e.error);
});

/**
 * 온라인/오프라인 상태 모니터링
 */
window.addEventListener('online', function() {
    console.log('인터넷 연결이 복구되었습니다.');
});

window.addEventListener('offline', function() {
    console.log('인터넷 연결이 끊어졌습니다.');
});
