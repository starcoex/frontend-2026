type ServiceFactory<T, Ctx> = (ctx: Ctx) => T;

export class ServiceRegistry<Ctx = any> {
  private instances = new Map<string, any>();
  private factories = new Map<string, ServiceFactory<any, Ctx>>();

  registerService<T>(key: string, factory: ServiceFactory<T, Ctx>): void {
    this.factories.set(key, factory);
  }

  initializeService<T>(key: string, ctx: Ctx): T {
    const factory = this.factories.get(key);
    if (!factory) {
      throw new Error(`Service factory not registered: ${key}`);
    }
    const instance = factory(ctx);
    this.instances.set(key, instance);
    return instance as T;
  }

  getService<T>(key: string): T {
    if (!this.instances.has(key)) {
      throw new Error(`Service not initialized: ${key}`);
    }
    return this.instances.get(key) as T;
  }

  isServiceInitialized(key: string): boolean {
    return this.instances.has(key);
  }
}

// 전역 레지스트리 인스턴스
export const serviceRegistry = new ServiceRegistry<any>();
