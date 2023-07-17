import { VueWrapper, shallowMount } from "@vue/test-utils";
import CampaignItem from "@/components/CampaignItem.vue";
import { INITIAL_CAMPAIGN } from "@/data/constants";
import { ComponentPublicInstance } from "vue";

const defaultProps = {
  campaign: { ...INITIAL_CAMPAIGN, id: 1 },
  showForm: false,
};

describe("CampaignItem", () => {
  const createWrapper = (
    props = defaultProps
  ): VueWrapper<ComponentPublicInstance> =>
    shallowMount(CampaignItem, { props });

  it("should render the component correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

  it("displays campaign details correctly", () => {
    // given
    const existingCampaign = {
      id: 1,
      name: "Campaign 1",
      keywords: ["keyword1", "keyword2"],
      bidAmount: 100,
      campaignFund: 1000,
      status: true,
      town: "Town",
      radius: 20,
    };

    // when
    const wrapper = createWrapper({
      ...defaultProps,
      campaign: existingCampaign,
    });

    // then
    expect(wrapper.find("h3").text()).toBe("Campaign 1");
    expect(wrapper.text()).toContain("Campaign fund: 1000$");
    expect(wrapper.text()).toContain("Town: Town");
    expect(wrapper.text()).toContain("Keywords: keyword1, keyword2");
    expect(wrapper.find("strong").text()).toBe("On");
  });

  it("disables buttons when showForm is true", () => {
    // when
    const wrapper = createWrapper({
      ...defaultProps,
      showForm: true,
    });

    // then
    const buttons = wrapper.findAll("button");
    buttons.forEach((button) => {
      expect(button.attributes("disabled")).toBeDefined();
    });
  });
});
