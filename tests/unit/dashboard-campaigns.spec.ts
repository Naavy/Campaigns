import { shallowMount, VueWrapper } from "@vue/test-utils";
import DashboardCampaigns from "@/components/DashboardCampaigns.vue";
import { ComponentPublicInstance } from "vue";

describe("DashboardCampaigns", () => {
  const createWrapper = (): VueWrapper<ComponentPublicInstance> =>
    shallowMount(DashboardCampaigns);

  it("should render the component correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

  it("changes the text and class when the button is clicked", async () => {
    // given
    const wrapper = createWrapper();
    const button = wrapper.find("button");
    expect(button.classes()).toContain("add-button");
    expect(button.text()).toBe("Add new campaign");

    // when
    await button.trigger("click");

    // then
    expect(button.classes()).toContain("cancel-button");
    expect(button.text()).toBe("Cancel");
  });
});
