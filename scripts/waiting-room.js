// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('1:1 대기방이 로드되었습니다.');
    
    // 요소들 가져오기
    const cancelMatchingBtn = document.getElementById('cancelMatchingBtn');
    
    // 대기 상태 초기화
    let isWaiting = true;
    
    // 매칭 취소 버튼 클릭 이벤트
    cancelMatchingBtn.addEventListener('click', function() {
        console.log('매칭 취소 요청됨');
        cancelMatching();
    });
    
    // 매칭 취소 함수
    function cancelMatching() {
        if (confirm('정말로 매칭을 취소하시겠습니까?')) {
            console.log('매칭이 취소되었습니다.');
            
            // 대기 상태 중지
            isWaiting = false;
            
            // 메인 페이지로 리다이렉트
            window.location.href = 'index.html';
        }
    }
    
    // 대기 상태 시뮬레이션 (실제로는 서버와 통신)
    simulateWaiting();
    
    // ESC 키로 매칭 취소
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cancelMatching();
        }
    });
});



/**
 * 대기 상태 시뮬레이션
 */
function simulateWaiting() {
    let timeElapsed = 0;
    const timeInterval = setInterval(() => {
        if (!isWaiting) {
            clearInterval(timeInterval);
            return;
        }
        
        timeElapsed += 1;
        
        // 2분 후 자동 매칭 완료 (테스트용)
        if (timeElapsed >= 120) {
            clearInterval(timeInterval);
            setTimeout(() => {
                matchComplete();
            }, 1000);
        }
    }, 1000);
}

/**
 * 매칭 완료 처리
 */
function matchComplete() {
    console.log('매칭이 완료되었습니다!');
    
    // 대기 상태 중지
    isWaiting = false;
    
    // 성공 메시지 표시
    const waitingCard = document.querySelector('.waiting-card');
    waitingCard.innerHTML = `
        <div class="match-success">
            <div class="success-icon">🎉</div>
            <h2 class="success-title">매칭 완료!</h2>
            <p class="success-message">상대방을 찾았습니다.</p>
            <div class="room-info">
                <p>방 ID: <strong>${generateRoomId()}</strong></p>
                <p>잠시 후 대화방으로 이동합니다...</p>
            </div>
        </div>
    `;
    
    // 3초 후 대화방으로 이동 (실제로는 방 생성 후 이동)
    setTimeout(() => {
        // TODO: 실제 대화방 페이지로 이동
        alert('대화방으로 이동합니다! (실제 구현 예정)');
        // window.location.href = 'chat-room.html';
    }, 3000);
}

/**
 * 랜덤 방 ID 생성
 */
function generateRoomId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * 페이지 언로드 시 정리
 */
window.addEventListener('beforeunload', function() {
    if (isWaiting) {
        // TODO: 서버에 대기 취소 요청
        console.log('페이지를 떠나면서 대기 상태가 취소됩니다.');
    }
});

/**
 * 페이지 가시성 변경 감지
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('페이지가 숨겨졌습니다.');
        // TODO: 백그라운드 처리 로직
    } else {
        console.log('페이지가 다시 활성화되었습니다.');
        // TODO: 포그라운드 처리 로직
    }
});
