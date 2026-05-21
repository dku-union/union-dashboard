import type { DocPage } from "../types";

export const bridgeApi: DocPage = {
  slug: "/docs/development/bridge-api",
  title: "Bridge API",
  description:
    "@union-miniapp/sdk가 제공하는 7개 모듈의 전체 메서드 레퍼런스. 모든 호출은 native와의 postMessage 비동기 요청-응답입니다.",
  category: "development",
  blocks: [
    {
      type: "text",
      title: "전역 객체",
      body: [
        "SDK는 import 시 자동으로 window.Union 전역에 등록됩니다. 미니앱 어디서든 import Union from \"@union-miniapp/sdk\"로 접근하세요.",
        "모든 메서드는 postMessage 기반이라 비동기입니다. 일부는 fire-and-forget(void 반환), 나머지는 Promise를 반환합니다.",
        "기본 타임아웃은 30초이며, 30초 내 응답이 없으면 UnionError(code='TIMEOUT')이 throw됩니다.",
      ],
    },
    {
      type: "api",
      title: "auth — 인증과 사용자 정보",
      items: [
        {
          module: "auth",
          signature: "Union.auth.login(): Promise<LoginResult>",
          description: "Union 계정으로 로그인. 성공 시 OAuth code를 반환합니다.",
          example: `const { code } = await Union.auth.login();
// code를 백엔드로 전달해 access token 교환`,
        },
        {
          module: "auth",
          signature: "Union.auth.getUserProfile(): Promise<UserProfile>",
          description: "현재 로그인한 사용자 프로필. university/email은 별도 권한이 있어야 채워집니다.",
          permission: "user.profile",
          example: `const profile = await Union.auth.getUserProfile();
console.log(profile.userId, profile.nickname);`,
        },
        {
          module: "auth",
          signature: "Union.auth.getAccessToken(): Promise<string>",
          description: "현재 세션의 access token. 백엔드 API 호출 시 Authorization 헤더에 사용합니다.",
          example: `const token = await Union.auth.getAccessToken();`,
        },
        {
          module: "auth",
          signature: "Union.auth.logout(): Promise<void>",
          description: "현재 세션을 종료합니다. 미니앱 단독 로그아웃이며 슈퍼앱 자체에는 영향을 주지 않습니다.",
          example: `await Union.auth.logout();`,
        },
      ],
    },
    {
      type: "api",
      title: "ui — 네이티브 UI 컴포넌트",
      items: [
        {
          module: "ui",
          signature: "Union.ui.showToast(options: ToastOptions): void",
          description: "네이티브 토스트 메시지 표시. duration은 'short' 또는 'long'.",
          example: `Union.ui.showToast({ message: "저장되었습니다", duration: "short" });`,
        },
        {
          module: "ui",
          signature: "Union.ui.showModal(options: ModalOptions): Promise<ModalResult>",
          description: "네이티브 확인/취소 모달. 사용자 선택을 confirmed boolean으로 반환합니다.",
          example: `const { confirmed } = await Union.ui.showModal({
  title: "정말 삭제할까요?",
  content: "되돌릴 수 없습니다.",
  confirmText: "삭제",
  cancelText: "취소",
});`,
        },
        {
          module: "ui",
          signature: "Union.ui.showLoading(message?: string): void",
          description: "네이티브 로딩 인디케이터를 표시합니다. 같은 호출이 중복되면 stack됩니다.",
          example: `Union.ui.showLoading("저장 중...");`,
        },
        {
          module: "ui",
          signature: "Union.ui.hideLoading(): void",
          description: "showLoading()으로 표시한 인디케이터를 숨깁니다.",
          example: `Union.ui.hideLoading();`,
        },
        {
          module: "ui",
          signature: "Union.ui.setNavigationBar(options: NavigationBarOptions): void",
          description: "네이티브 네비게이션 바의 제목, 배경색, 텍스트 색상을 변경합니다.",
          example: `Union.ui.setNavigationBar({ title: "프로필", backgroundColor: "#FFFFFF" });`,
        },
        {
          module: "ui",
          signature: "Union.ui.close(): void",
          description: "현재 미니앱을 닫고 슈퍼앱으로 돌아갑니다.",
          example: `Union.ui.close();`,
        },
      ],
    },
    {
      type: "api",
      title: "device — 하드웨어 접근",
      items: [
        {
          module: "device",
          signature: "Union.device.getLocation(): Promise<LocationResult>",
          description: "현재 위치를 한 번 가져옵니다. 백그라운드 추적은 지원하지 않습니다.",
          permission: "device.location",
          example: `const { latitude, longitude, accuracy } = await Union.device.getLocation();`,
        },
        {
          module: "device",
          signature: "Union.device.scanQRCode(): Promise<QRCodeResult>",
          description: "QR 스캐너를 띄우고 사용자가 스캔한 결과를 반환합니다. 사용자가 취소하면 에러.",
          permission: "device.camera",
          example: `const { result } = await Union.device.scanQRCode();`,
        },
        {
          module: "device",
          signature: "Union.device.getClipboard(): Promise<string>",
          description: "시스템 클립보드의 텍스트를 읽습니다.",
          example: `const text = await Union.device.getClipboard();`,
        },
        {
          module: "device",
          signature: "Union.device.setClipboard(text: string): Promise<void>",
          description: "시스템 클립보드에 텍스트를 씁니다.",
          example: `await Union.device.setClipboard("https://example.com");`,
        },
        {
          module: "device",
          signature: "Union.device.vibrate(type?: VibrationType): void",
          description: "햅틱 피드백. type은 'light' | 'medium' | 'heavy', 기본 'medium'.",
          example: `Union.device.vibrate("light");`,
        },
      ],
    },
    {
      type: "api",
      title: "storage — 미니앱 전용 저장소",
      items: [
        {
          module: "storage",
          signature: "Union.storage.get<T>(key: string): Promise<T | null>",
          description: "키로 값을 읽습니다. 다른 미니앱과 격리되어 있습니다.",
          example: `const draft = await Union.storage.get<Draft>("draft-1");`,
        },
        {
          module: "storage",
          signature: "Union.storage.set(key: string, value: unknown): Promise<void>",
          description: "키-값을 저장합니다. JSON 직렬화 가능한 값만 허용됩니다.",
          example: `await Union.storage.set("draft-1", { title: "초안" });`,
        },
        {
          module: "storage",
          signature: "Union.storage.remove(key: string): Promise<void>",
          description: "특정 키를 삭제합니다.",
          example: `await Union.storage.remove("draft-1");`,
        },
        {
          module: "storage",
          signature: "Union.storage.clear(): Promise<void>",
          description: "이 미니앱의 모든 키를 삭제합니다.",
          example: `await Union.storage.clear();`,
        },
      ],
    },
    {
      type: "api",
      title: "navigation — 네이티브 페이지 스택",
      items: [
        {
          module: "navigation",
          signature: "Union.navigation.push(url: string, options?): Promise<NavigationPushResult>",
          description: "새로운 미니앱 화면을 네이티브 스택에 push합니다. 같은 미니앱 내 라우팅에 사용합니다.",
          example: `await Union.navigation.push("/detail/123", { animated: true });`,
        },
        {
          module: "navigation",
          signature: "Union.navigation.back(): void",
          description: "스택의 이전 화면으로 돌아갑니다.",
          example: `Union.navigation.back();`,
        },
        {
          module: "navigation",
          signature: "Union.navigation.replace(url: string): void",
          description: "현재 스택의 최상단을 새 url로 교체합니다.",
          example: `Union.navigation.replace("/home");`,
        },
        {
          module: "navigation",
          signature: "Union.navigation.prefetch(url: string): void",
          description: "다음 화면을 미리 로드해 전환 속도를 줄입니다.",
          example: `Union.navigation.prefetch("/detail/123");`,
        },
      ],
    },
    {
      type: "api",
      title: "network — mTLS 자동 적용 HTTP",
      items: [
        {
          module: "network",
          signature: "Union.request(options: RequestOptions): Promise<RequestResult>",
          description: "Union 백엔드 API 호출 시 mTLS 인증서가 자동으로 적용됩니다. 직접 fetch보다 이쪽이 안전합니다.",
          example: `const { statusCode, data } = await Union.request({
  url: "https://api.union.app/v1/me",
  method: "GET",
});`,
        },
      ],
    },
    {
      type: "api",
      title: "analytics — 이벤트 추적",
      items: [
        {
          module: "analytics",
          signature: "Union.analytics.trackEvent(eventName: string, params?: EventParams): void",
          description: "커스텀 이벤트를 기록합니다. 이벤트명은 snake_case 권장.",
          example: `Union.analytics.trackEvent("button_clicked", { label: "submit" });`,
        },
        {
          module: "analytics",
          signature: "Union.analytics.trackPageView(pageName: string, referrer?: string): void",
          description: "화면 전환을 기록합니다. SPA 라우팅 시점에 호출하세요.",
          example: `Union.analytics.trackPageView("/detail/123", document.referrer);`,
        },
        {
          module: "analytics",
          signature: "Union.analytics.trackError(error: Error | string, context?: ErrorContext): void",
          description: "JS 에러를 기록합니다. fatal: true는 복구 불가능한 에러에만 사용하세요.",
          example: `try { ... } catch (e) {
  Union.analytics.trackError(e, { context: { screen: "checkout" } });
}`,
        },
        {
          module: "analytics",
          signature: "Union.analytics.trackConversion(conversionType: string, params?: ConversionParams): void",
          description: "전환 이벤트(가입, 구매, 신청 등)를 기록합니다.",
          example: `Union.analytics.trackConversion("signup", { value: 0, label: "festival" });`,
        },
        {
          module: "analytics",
          signature: "Union.analytics.setUserProperty(key: string, value: UserPropertyValue): void",
          description: "현재 세션의 사용자 속성을 설정합니다. PII는 절대 넣지 마세요.",
          example: `Union.analytics.setUserProperty("plan", "pro");`,
        },
      ],
    },
    {
      type: "callout",
      tone: "warning",
      title: "이벤트 명명과 PII",
      body:
        "이벤트명은 snake_case, 동사 위주로(button_clicked, page_viewed). 파라미터에 사용자 이름, 이메일, 전화번호, 학번 같은 식별 가능한 정보(PII)를 절대 넣지 마세요. PII가 감지되면 자동 마스킹되거나 이벤트 자체가 폐기됩니다.",
    },
    {
      type: "text",
      title: "이벤트 구독 (Union.on / Union.off)",
      body: [
        "네이티브에서 발생하는 이벤트를 구독할 수 있습니다.",
        "주요 이벤트: 'app:pause', 'app:resume', 'auth:expired', 'network:online', 'network:offline', 'navigation:didPush'.",
      ],
    },
    {
      type: "code",
      title: "구독 예시",
      language: "typescript",
      code: `function handleResume() {
  // 백그라운드에서 돌아올 때 데이터 새로고침
  refreshData();
}

Union.on("app:resume", handleResume);

// 컴포넌트 unmount 시 반드시 해제
Union.off("app:resume", handleResume);`,
    },
    {
      type: "callout",
      tone: "info",
      title: "에러 처리",
      body:
        "모든 비동기 메서드는 실패 시 UnionError를 throw합니다. error.code는 'PERMISSION_DENIED', 'TIMEOUT', 'CANCELLED', 'NETWORK_ERROR' 등 표준 코드로 분류되어 있습니다. try/catch로 감싸 fallback UX를 제공하세요.",
    },
  ],
};
