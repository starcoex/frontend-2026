type ServiceFactory<T, Ctx> = (ctx: Ctx) => T;

export class ServiceRegistry<Ctx = any> {
  private instances = new Map<string, any>();
  private factories = new Map<string, ServiceFactory<any, Ctx>>();

  /**
   * 서비스 팩토리를 등록합니다.
   * 아직 인스턴스를 생성하지 않으며, 초기화 로직만 저장합니다.
   */
  registerService<T>(key: string, factory: ServiceFactory<T, Ctx>): void {
    this.factories.set(key, factory);
  }

  /**
   * 등록된 팩토리를 사용하여 서비스를 초기화(인스턴스 생성)합니다.
   * 생성된 인스턴스는 내부에 캐싱됩니다.
   */
  initializeService<T>(key: string, ctx: Ctx): T {
    const factory = this.factories.get(key);
    if (!factory) {
      throw new Error(`Service factory not registered: ${key}`);
    }
    // 이미 초기화되어 있다면 기존 인스턴스 반환 (싱글톤 보장)
    if (this.instances.has(key)) {
      return this.instances.get(key) as T;
    }

    const instance = factory(ctx);
    this.instances.set(key, instance);
    return instance as T;
  }

  /**
   * 이미 초기화된 서비스 인스턴스를 가져옵니다.
   * 초기화되지 않은 경우 에러를 발생시킵니다.
   */
  getService<T>(key: string): T {
    if (!this.instances.has(key)) {
      throw new Error(`Service not initialized: ${key}`);
    }
    return this.instances.get(key) as T;
  }

  /**
   * 서비스가 초기화되었는지 확인합니다.
   */
  isServiceInitialized(key: string): boolean {
    return this.instances.has(key);
  }

  /**
   * 테스트 등의 목적으로 레지스트리를 초기화할 때 사용합니다.
   */
  clear(): void {
    this.instances.clear();
    this.factories.clear();
  }
}

// 전역적으로 사용할 레지스트리 인스턴스
export const serviceRegistry = new ServiceRegistry<any>();
