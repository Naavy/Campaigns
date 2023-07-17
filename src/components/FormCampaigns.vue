<template>
  <form
    class="form-container"
    @submit.prevent="editMode ? editCampaign() : addCampaign()"
  >
    <h2>{{ editMode ? "Edit campaign" : "Add campaign" }}</h2>
    <div class="form">
      <label>Campaign Name (required) {{ editedCampaign.name ? "✓" : "" }}</label>
      <input
        type="text"
        placeholder="Campaign Name"
        v-model="editedCampaign.name"
        required
      />
      <label>Select Keywords (required) {{ keywordsList.length > 0 ? "✓" : "" }}</label>
      <input
        type="text"
        placeholder="Keywords..."
        v-model="newKeyword"
        @input="searchKeyword($event)"
        @keydown.enter.prevent="addKeyword"
      />
      <div v-if="suggestedKeywordsList.length > 0" class="suggestion-container">
        <div
          v-for="(keyword, index) in suggestedKeywordsList"
          :key="index"
          @click="selectKeyword(index)"
          class="suggestion"
        >
          {{ keyword }}
        </div>
      </div>
      <button
        type="button"
        @click="addKeyword"
        :disabled="newKeyword.trim() === ''"
        class="add-keyword"
      >
        Add keyword
      </button>
      <div class="keywords-container">
        <div
          v-for="(keyword, index) in keywordsList"
          :key="index"
          class="keyword"
        >
          {{ keyword }}
          <button type="button" @click="removeKeyword(index)">x</button>
        </div>
      </div>
      <label>Bid Amount (min 100) {{ editedCampaign.bidAmount >= 100 ? "✓" : "" }}</label>
      <input
        type="number"
        placeholder="Bid Amount"
        min="100"
        v-model="editedCampaign.bidAmount"
      />
      <label>Campaign Fund (more than 0) {{ editedCampaign.campaignFund > 0 ? "✓" : "" }}</label>
      <input
        type="number"
        placeholder="Campaign Fund"
        min="1"
        v-model="editedCampaign.campaignFund"
      />
      <label>Town</label>
      <select v-model="editedCampaign.town">
        <option v-for="city in citiesList" :key="city.id">
          {{ city.name }}
        </option>
      </select>
      <label>Radius </label>
      <input type="text" placeholder="Radius" v-model="editedCampaign.radius" />
      <label>Status</label>
      <div class="status">
        <input
          type="checkbox"
          id="checkbox"
          v-model="editedCampaign.status"
          @change="changeStatus"
        />
        <label id="checkbox">{{ status }}</label>
      </div>
    </div>
    <button
      type="submit"
      :disabled="
        editedCampaign.name === '' ||
        keywordsList.length === 0 ||
        editedCampaign.bidAmount < 100 ||
        editedCampaign.campaignFund <= 0
      "
    >
      {{ editMode ? "Save" : "Add" }}
    </button>
  </form>
</template>

<script lang="ts">
import { ref, onBeforeMount, SetupContext, PropType, watch } from "vue";
import cities from "@/data/cities.json";
import { INITIAL_CAMPAIGN, KEYWORDS } from "@/data/constants";
import { CampaignType } from "@/types/campaign";

export default {
  name: "FormCampaigns",
  props: {
    editMode: {
      type: Boolean,
      required: true,
    },
    campaign: {
      type: Object as PropType<Omit<CampaignType, "id">>,
      required: true,
    },
  },
  setup(props: any, context: SetupContext) {
    const citiesList = cities;
    const editedCampaign = ref(INITIAL_CAMPAIGN);
    const status = ref("On");
    const newKeyword = ref("");
    const keywordsList = ref<string[]>([]);
    const suggestedKeywordsList = ref<string[]>([]);

    onBeforeMount(() => {
      editedCampaign.value = { ...props.campaign };
      keywordsList.value = [...props.campaign.keywords];
    });

    watch(
      keywordsList,
      (newKeywordsList) => {
        suggestedKeywordsList.value.filter(
          (value) => !newKeywordsList.includes(value)
        );
      },
      { deep: true }
    );

    function addCampaign() {
      context.emit("add", editedCampaign, keywordsList.value);
    }

    function editCampaign() {
      context.emit("edit", editedCampaign, keywordsList.value);
    }

    function changeStatus() {
      status.value = editedCampaign.value.status ? "On" : "Off";
    }

    function addKeyword() {
      if (!keywordsList.value.includes(newKeyword.value)) {
        keywordsList.value.push(newKeyword.value);
      }
      newKeyword.value = "";
    }

    function removeKeyword(index: number) {
      keywordsList.value.splice(index, 1);
    }

    function searchKeyword(e: Event) {
      const text = (e.target as HTMLInputElement).value;
      suggestedKeywordsList.value =
        text === ""
          ? []
          : (suggestedKeywordsList.value = KEYWORDS.filter(
              (keyword) => !keywordsList.value.includes(keyword)
            ).filter((keyword) => keyword.includes(text)));
    }

    function selectKeyword(index: number) {
      keywordsList.value.push(suggestedKeywordsList.value[index]);
      newKeyword.value = "";
      suggestedKeywordsList.value = [];
    }

    return {
      status,
      newKeyword,
      keywordsList,
      suggestedKeywordsList,
      editedCampaign,
      citiesList,
      addCampaign,
      editCampaign,
      changeStatus,
      addKeyword,
      removeKeyword,
      searchKeyword,
      selectKeyword,
    };
  },
};
</script>

<style scoped lang="scss">
.form-container {
  border: 1px #60dafb solid;
  border-radius: 5px;
  padding: 20px;
  margin: 20px;
  width: 300px;
}

button {
  padding: 10px 20px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 5px;
  margin: 0 15px;
  width: 100px;
  border: 1px #60dafb solid;

  &:disabled {
    opacity: 0.5;
  }
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 50px;

  label {
    font-size: 12px;
    margin-top: 20px;
  }

  input,
  select {
    width: 200px;
    margin: 0;
    padding: 10px;
    border-radius: 5px;
    border: 1px black solid;
  }

  select {
    width: 222px;
  }

  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
    outline: none;
  }

  .status {
    width: 222px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    input {
      width: fit-content;
      margin-right: 5px;
    }
  }

  .add-keyword {
    font-size: 11px;
    padding: 2px 5px;
    margin: 10px 0;
  }

  .keywords-container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .keyword {
      background-color: #53a163;
      padding: 5px 10px;
      border-radius: 5px;
      margin: 2px;

      button {
        width: min-content;
        padding: 1px;
        margin: 0;
        background-color: transparent;
        border: none;
        font-weight: 700;
      }
    }
  }
  #checkbox {
    margin-top: 0;
  }

  .suggestion-container {
    background-color: white;
    color: black;
    width: 222px;
    border-radius: 5px;

    .suggestion:hover {
      opacity: 0.6;
      cursor: pointer;
    }
  }
}
</style>
