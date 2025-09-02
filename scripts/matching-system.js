/**
 * Bot or Not Room 매치메이킹 시스템
 * 대기열 관리 및 자동 매칭 기능
 */

class MatchingSystem {
    constructor() {
        // 대기열 (FIFO 방식)
        this.waitingQueue = [];
        
        // 활성 방 목록
        this.activeRooms = new Map();
        
        // 매칭 상태
        this.isMatching = false;
        
        // 매칭 간격 (밀리초)
        this.matchingInterval = 1000;
        
        // 매칭 타이머
        this.matchingTimer = null;
        
        console.log('매치메이킹 시스템이 초기화되었습니다.');
        
        // 매칭 프로세스 시작
        this.startMatchingProcess();
    }
    
    /**
     * 사용자를 대기열에 추가
     * @param {Object} user - 사용자 정보
     * @returns {number} 대기열 위치
     */
    addToQueue(user) {
        const userInfo = {
            id: user.id || this.generateUserId(),
            name: user.name || '익명',
            joinTime: Date.now(),
            status: 'waiting'
        };
        
        this.waitingQueue.push(userInfo);
        console.log(`사용자 ${userInfo.name}이(가) 대기열에 추가되었습니다. (위치: ${this.waitingQueue.length})`);
        
        return this.waitingQueue.length;
    }
    
    /**
     * 사용자를 대기열에서 제거
     * @param {string} userId - 사용자 ID
     * @returns {boolean} 제거 성공 여부
     */
    removeFromQueue(userId) {
        const index = this.waitingQueue.findIndex(user => user.id === userId);
        if (index !== -1) {
            const removedUser = this.waitingQueue.splice(index, 1)[0];
            console.log(`사용자 ${removedUser.name}이(가) 대기열에서 제거되었습니다.`);
            return true;
        }
        return false;
    }
    
    /**
     * 대기열 상태 조회
     * @returns {Object} 대기열 정보
     */
    getQueueStatus() {
        return {
            totalWaiting: this.waitingQueue.length,
            estimatedWaitTime: this.calculateEstimatedWaitTime(),
            queue: this.waitingQueue.map((user, index) => ({
                position: index + 1,
                name: user.name,
                joinTime: user.joinTime
            }))
        };
    }
    
    /**
     * 예상 대기 시간 계산
     * @returns {string} 예상 대기 시간
     */
    calculateEstimatedWaitTime() {
        const queueLength = this.waitingQueue.length;
        if (queueLength === 0) return '즉시';
        if (queueLength === 1) return '1-2분';
        
        const estimatedMinutes = Math.ceil(queueLength / 2);
        return `${estimatedMinutes}-${estimatedMinutes + 1}분`;
    }
    
    /**
     * 매칭 프로세스 시작
     */
    startMatchingProcess() {
        if (this.matchingTimer) {
            clearInterval(this.matchingTimer);
        }
        
        this.matchingTimer = setInterval(() => {
            this.processMatching();
        }, this.matchingInterval);
        
        console.log('매칭 프로세스가 시작되었습니다.');
    }
    
    /**
     * 매칭 처리
     */
    processMatching() {
        if (this.waitingQueue.length < 2) {
            return; // 2명 미만이면 매칭 불가
        }
        
        // 2명씩 순서대로 매칭
        while (this.waitingQueue.length >= 2) {
            const user1 = this.waitingQueue.shift();
            const user2 = this.waitingQueue.shift();
            
            // 매칭 생성
            const match = this.createMatch(user1, user2);
            
            if (match) {
                console.log(`매칭 완료: ${user1.name} + ${user2.name} → 방 ${match.roomId}`);
                
                // 매칭된 사용자들에게 알림
                this.notifyMatch(user1, match);
                this.notifyMatch(user2, match);
            }
        }
    }
    
    /**
     * 매칭 생성
     * @param {Object} user1 - 첫 번째 사용자
     * @param {Object} user2 - 두 번째 사용자
     * @returns {Object} 매칭 정보
     */
    createMatch(user1, user2) {
        const roomId = this.generateRoomId();
        const matchTime = Date.now();
        
        const match = {
            roomId: roomId,
            users: [user1, user2],
            matchTime: matchTime,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        
        // 방 정보 저장
        this.activeRooms.set(roomId, match);
        
        // 사용자 상태 업데이트
        user1.status = 'matched';
        user1.roomId = roomId;
        user2.status = 'matched';
        user2.roomId = roomId;
        
        return match;
    }
    
    /**
     * 매칭 완료 알림
     * @param {Object} user - 사용자
     * @param {Object} match - 매칭 정보
     */
    notifyMatch(user, match) {
        // 실제로는 WebSocket이나 Server-Sent Events를 사용
        // 여기서는 콘솔 로그로 대체
        console.log(`사용자 ${user.name}에게 매칭 알림:`, {
            roomId: match.roomId,
            partner: match.users.find(u => u.id !== user.id)?.name,
            matchTime: match.matchTime
        });
        
        // 매칭 완료 페이지로 리다이렉트
        const redirectUrl = `match-complete.html?roomId=${match.roomId}&matchTime=${match.matchTime}`;
        
        // 현재 페이지가 대기방인 경우에만 리다이렉트
        if (window.location.pathname.includes('waiting-room')) {
            window.location.href = redirectUrl;
        }
    }
    
    /**
     * 방 ID 생성
     * @returns {string} 고유한 방 ID
     */
    generateRoomId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    /**
     * 사용자 ID 생성
     * @returns {string} 고유한 사용자 ID
     */
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * 방 정보 조회
     * @param {string} roomId - 방 ID
     * @returns {Object} 방 정보
     */
    getRoomInfo(roomId) {
        return this.activeRooms.get(roomId);
    }
    
    /**
     * 활성 방 목록 조회
     * @returns {Array} 활성 방 목록
     */
    getActiveRooms() {
        return Array.from(this.activeRooms.values());
    }
    
    /**
     * 매칭 시스템 상태 조회
     * @returns {Object} 시스템 상태
     */
    getSystemStatus() {
        return {
            waitingUsers: this.waitingQueue.length,
            activeRooms: this.activeRooms.size,
            isMatching: this.isMatching,
            uptime: Date.now() - this.startTime
        };
    }
    
    /**
     * 매칭 시스템 중지
     */
    stop() {
        if (this.matchingTimer) {
            clearInterval(this.matchingTimer);
            this.matchingTimer = null;
        }
        this.isMatching = false;
        console.log('매칭 시스템이 중지되었습니다.');
    }
}

// 전역 매치메이킹 시스템 인스턴스 생성
window.matchingSystem = new MatchingSystem();

// 전역 함수로 노출 (다른 스크립트에서 사용)
window.addToMatchingQueue = function(user) {
    return window.matchingSystem.addToMatchingQueue(user);
};

window.removeFromMatchingQueue = function(userId) {
    return window.matchingSystem.removeFromMatchingQueue(userId);
};

window.getMatchingQueueStatus = function() {
    return window.matchingSystem.getQueueStatus();
};
