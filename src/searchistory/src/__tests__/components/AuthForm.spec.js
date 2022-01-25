import { shallowMount, flushPromises } from "@vue/test-utils";
import AuthForm from "../../components/Auth/AuthForm.vue";
import router from "../../router";
import { createApp, ref } from "vue";
import { createPinia } from 'pinia';
createApp(AuthForm).use(createPinia())


// コンポーネントテスト
describe("コンポーネントテスト", () => {
  it("email,password正しい:ログイン可", async () => {
    const wrapper = shallowMount(AuthForm, {
      props: { isSignUp: false },
      global: {
        plugins: [router],
      },
    });
    await router.isReady();
    wrapper.find('[data-testid="inputEmail"]').setValue("1@g.com")
    wrapper.find('[data-testid="inputPassword"]').setValue("11111111")
    const result = await wrapper.vm.signin(false);
    flushPromises();
    expect(result).toEqual(true);

  });
  it("email正しくない:ログイン不可", async () => {
    const wrapper = shallowMount(AuthForm, {
      props: { isSignUp: false },
      global: {
        plugins: [router],
      },
    });
    await router.isReady();
    wrapper.find('[data-testid="inputEmail"]').setValue("111@g.com")
    wrapper.find('[data-testid="inputPassword"]').setValue("11111111")
    const result = await wrapper.vm.signin(false);
    flushPromises();
    expect(result).toEqual(false);

  });
  it("password正しくない:ログイン不可", async () => {
    const wrapper = shallowMount(AuthForm, {
      props: { isSignUp: false },
      global: {
        plugins: [router],
      },
    });
    await router.isReady();
    wrapper.find('[data-testid="inputEmail"]').setValue("1@g.com")
    wrapper.find('[data-testid="inputPassword"]').setValue("22222222")
    const result = await wrapper.vm.signin(false);
    flushPromises();
    expect(result).toEqual(false);

  });
  it("isSignUp:falseでログイン画面", () => {
    const wrapper = shallowMount(AuthForm, {
      props: { isSignUp: false },
    });
    expect(wrapper.text()).toMatch("ログイン");
  });

  it("trueで新規登録画面", () => {
    const wrapper = shallowMount(AuthForm, {
      props: { isSignUp: true },
    });
    expect(wrapper.text()).toMatch("新規登録");
  });
});

// 単体テスト
