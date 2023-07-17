<template>
  <div class="item" :class="{ edited: showForm }">
    <h3>{{ campaign.name }}</h3>
    <div>Campaign fund: {{ campaign.campaignFund }}$</div>
    <div>Town: {{ campaign.town }}</div>
    Keywords:
    {{ campaign.keywords.join(", ") }}
    <div>
      Status: <strong>{{ campaign.status ? "On" : "Off" }}</strong>
    </div>
    <div class="buttons">
      <button @click="removeCampagin()" :disabled="showForm">Remove</button>
      <button @click="changeMode()" :disabled="showForm">Edit</button>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, SetupContext } from "vue";
import { CampaignType } from "@/types/campaign";

export default {
  name: "CampaignItem",
  props: {
    campaign: {
      type: Object as PropType<CampaignType>,
      required: true,
    },
    showForm: {
      type: Boolean,
      required: true,
    },
  },
  setup(props: any, context: SetupContext) {
    function removeCampagin() {
      context.emit("removeClicked", props.campaign.id);
    }

    function changeMode() {
      context.emit("switchMode", props.campaign);
    }

    return {
      removeCampagin,
      changeMode,
    };
  },
};
</script>

<style scoped lang="scss">
.item {
  padding: 20px;
  border: 1px solid #60dafb;
  border-radius: 5px;
  margin: 30px 20px;
  width: 300px;

  button {
    margin: 5px 20px;
    width: 150px;
    padding: 10px 20px;
    background-color: #2c3e50;
    color: white;
    border: none;
    border-radius: 5px;
    border: 1px #60dafb solid;
  }
}
.edited {
  opacity: 0.6;
}
.buttons {
  display: flex;
  margin-top: 20px;
}
</style>
