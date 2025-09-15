import { mount } from "@vue/test-utils"
import SignUp from "@/views/SignUp.vue"

import { useToast } from "vue-toastification"
const toast = useToast()

jest.mock("vue-toastification", () => {
  return {
    useToast: () => ({
      success: jest.fn(),
      error: jest.fn(),
    }),
  }
})


const mockPush = jest.fn()
jest.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))


const mockDispatch = jest.fn()
jest.mock("vuex", () => ({
  useStore: () => ({
    dispatch: mockDispatch,
  }),
}))

describe("Signup.vue", () => {
  it("renders signup form", () => {
    const wrapper = mount(SignUp)
    expect(wrapper.exists()).toBe(true)
  })

  it("shows validation errors when form is empty", async () => {
    const wrapper = mount(SignUp)
    
    await wrapper.find("form").trigger("submit.prevent")

    expect(wrapper.text()).toContain("First Name Should not be null")
    expect(wrapper.text()).toContain("Last Name should not be null")
    expect(wrapper.text()).toContain("Email should not be null")
    expect(wrapper.text()).toContain("password should not be null")
  })
  it("when form is working fine",async ()=>{
    const wrapper=mount(SignUp);
    await wrapper.find('input[name="firstName"]').setValue("Harry")
    await wrapper.find('input[name="lastName"]').setValue("make")
    await wrapper.find('input[name="email"]').setValue("Harry@gmail.com")
    await wrapper.find('input[name="password"]').setValue("Harry123")


    await wrapper.find("form").trigger("submit.prevent")

    expect(mockDispatch).toHaveBeenCalledWith("auth/fetchUserInfo",{
        firstName:"Harry",
        lastName:"make",
        email:"Harry@gmail.com",
        password:"Harry123"
    })
  })
    it("shows error if first name is missing", async () => {
        const wrapper = mount(SignUp)

        await wrapper.find('input[name="lastName"]').setValue("Doe")
        await wrapper.find('input[name="email"]').setValue("jane@gmail.com")
        await wrapper.find('input[name="password"]').setValue("12345")

        await wrapper.find("form").trigger("submit.prevent")

        expect(wrapper.find(".error-text").text()).toContain("First Name Should not be null")
    })
    // it("shows success toast after signup", async () => {
    //     mockDispatch.mockResolvedValueOnce({ success: true })

    //     const wrapper = mount(SignUp)
    //     await wrapper.find('input[name="firstName"]').setValue("Harry")
    //     await wrapper.find('input[name="lastName"]').setValue("make")
    //     await wrapper.find('input[name="email"]').setValue("Harry@gmail.com")
    //     await wrapper.find('input[name="password"]').setValue("Harry123")

    //     await wrapper.find("form").trigger("submit.prevent")

    //     expect(toast.success).toHaveBeenCalled()
    // })
})
