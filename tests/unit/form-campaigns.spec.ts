import { VueWrapper, shallowMount } from "@vue/test-utils";
import { ComponentPublicInstance, ref } from "vue";
import FormCampaigns from "@/components/FormCampaigns.vue";
import { INITIAL_CAMPAIGN } from "@/data/constants";

const defaultProps = {
  campaign: INITIAL_CAMPAIGN,
  editMode: false,
};

describe("FormCampaigns", () => {
  const createWrapper = (
    props = defaultProps
  ): VueWrapper<ComponentPublicInstance> =>
    shallowMount(FormCampaigns, { props });

  it("should render the component correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

  it("should display the correct title based on edit mode", () => {
    // given
    let wrapper = createWrapper();
    expect(wrapper.find("h2").text()).toBe("Add campaign");

    // when
    wrapper = createWrapper({ ...defaultProps, editMode: true });

    // then
    expect(wrapper.find("h2").text()).toBe("Edit campaign");
  });

  it("should enable submit button when all required fields are filled", async () => {
    // given
    const wrapper = createWrapper();
    expect(
      wrapper.find("button[type='submit']").attributes("disabled")
    ).toBeDefined();

    // when
    await wrapper
      .find("input[placeholder='Campaign Name']")
      .setValue("Test Campaign");
    await wrapper.find("input[placeholder='Keywords...']").setValue("keyword1");
    await wrapper.find(".add-keyword").trigger("click");
    await wrapper.find("input[placeholder='Bid Amount']").setValue("200");
    await wrapper.find("input[placeholder='Campaign Fund']").setValue("1000");

    // then
    expect(
      wrapper.find("button[type='submit']").attributes("disabled")
    ).toBeUndefined();
  });

  it("should add a keyword when 'Add keyword' button is clicked", async () => {
    // given
    const wrapper = createWrapper();
    expect(wrapper.findAll(".keyword")).toHaveLength(0);

    // when
    await wrapper.find("input[placeholder='Keywords...']").setValue("keyword1");
    await wrapper.find(".add-keyword").trigger("click");

    // then
    expect(wrapper.findAll(".keyword")).toHaveLength(1);
  });

  it("should remove a keyword when 'x' button is clicked", async () => {
    // given
    const wrapper = createWrapper({
      ...defaultProps,
      campaign: {
        ...defaultProps.campaign,
        keywords: ["keyword1", "keyword2", "keyword3"],
      },
    });
    const initialKeywords = wrapper.findAll(".keyword");
    expect(initialKeywords.length).toBe(3);

    // when
    await wrapper.findAll(".keyword button")[0].trigger("click");

    // then
    expect(wrapper.findAll(".keyword").length).toBe(2);
  });
});
