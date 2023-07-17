<template>
  <h1>Emerald account funds: {{ account }}$</h1>
  <button :class="showForm ? 'cancel-button' : 'add-button'" @click="openForm">
    {{ showForm ? "Cancel" : "Add new campaign" }}
  </button>
  <FormCampaigns
    v-if="showForm"
    @add="addCampaign"
    @edit="editCampaign"
    :campaign="editedCampaign"
    :editMode="editMode"
  />
  <div class="list">
    <CampaignItem
      v-for="campaign in campaignsList"
      :key="campaign.id"
      :campaign="campaign"
      :showForm="showForm"
      @removeClicked="removeCampagin"
      @switchMode="switchEditMode"
    />
  </div>
  <div v-if="campaignsList.length === 0" style="margin-top: 20px">
    You don't have any campaigns. Add a new one!
  </div>
</template>

<script lang="ts">
import { ref, Ref, onBeforeMount, watch } from "vue";
import CampaignItem from "./CampaignItem.vue";
import FormCampaigns from "./FormCampaigns.vue";
import campaigns from "@/data/campaigns.json";
import { INITIAL_ACCOUNT, INITIAL_CAMPAIGN } from "@/data/constants";
import { CampaignType } from "@/types/campaign";

export default {
  name: "DashboardCampaigns",
  components: {
    CampaignItem,
    FormCampaigns,
  },
  setup() {
    const account = ref(INITIAL_ACCOUNT);
    const editedCampaign = ref(INITIAL_CAMPAIGN);
    const campaignsList = ref<CampaignType[]>(campaigns);
    const showForm = ref(false);
    const editMode = ref(false);

    onBeforeMount(() => {
      const localStorageData = localStorage.getItem("campaignsList");
      if (localStorageData) {
        campaignsList.value = [...JSON.parse(localStorageData)];
      }
      updateFund();
    });

    watch(
      campaignsList,
      (newCampaignsList) => {
        localStorage.setItem("campaignsList", JSON.stringify(newCampaignsList));
        updateFund();
      },
      { deep: true }
    );

    function updateFund() {
      account.value = INITIAL_ACCOUNT;
      const startFund = campaignsList.value
        .filter((campgaign) => campgaign.status)
        .reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.campaignFund,
          0
        );
      account.value = account.value - startFund;
    }

    function openForm() {
      showForm.value = !showForm.value;
      editMode.value = false;
      editedCampaign.value = INITIAL_CAMPAIGN;
    }

    function addCampaign(
      newCampaign: Ref<CampaignType>,
      keywordsList: string[]
    ) {
      campaignsList.value.push({
        ...newCampaign.value,
        keywords: [...keywordsList],
        id: Math.floor(Math.random() * 100000),
      });
      showForm.value = false;
    }

    function editCampaign(
      editedCampaign: Ref<CampaignType>,
      keywordsList: string[]
    ) {
      const index = campaignsList.value.findIndex(
        (campaign) => campaign.id === editedCampaign.value.id
      );
      campaignsList.value[index] = {
        ...editedCampaign.value,
        keywords: [...keywordsList],
      };
      editMode.value = false;
      showForm.value = false;
    }

    function removeCampagin(id: number) {
      campaignsList.value = campaignsList.value.filter(
        (campaign) => campaign.id != id
      );
    }

    function switchEditMode(campaign: CampaignType) {
      editMode.value = true;
      showForm.value = true;
      editedCampaign.value = campaign;
      window.scrollTo({
        top: 200,
        behavior: "smooth",
      });
    }

    return {
      account,
      campaignsList,
      showForm,
      editMode,
      editedCampaign,
      updateFund,
      openForm,
      addCampaign,
      editCampaign,
      removeCampagin,
      switchEditMode,
    };
  },
};
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.add-button,
.cancel-button {
  padding: 20px;
  border: none;
  border-radius: 5px;
  color: white;
  background-color: #53a163;
  font-weight: bold;
}

.cancel-button {
  background-color: #2c3e50;
  border: 1px #60dafb solid;
}
</style>
