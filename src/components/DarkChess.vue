<template>
  <li
    :class="['box', isActive ? 'bg-yellow-200' : '']"
    @click="handleClick"
  >
    <span v-if="data.id">
      <span
        :class="['chess', isRed ? 'text-red-700 border-red-700' : '']"
        v-if="data.isOpen"
      >
        {{ getChessLabel(data?.type) }}
      </span>
      <span class="chess back" v-else></span>
    </span>
  </li>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { CHESS_LIST } from '../model/chessPieceConstant';

@Component
export default class ChessElement extends Vue {
  @Prop(Object) data!: { id: string; type: string; isOpen: boolean };
  @Prop(Number) index!: number;
  @Prop(Function) clickChess!: (data: { id: string; type: string; isOpen: boolean }) => void;
  @Prop(Boolean) isActive!: boolean;
  @Prop({ type: Object as () => Record<string, number>, required: true }) count!: Record<string, number>;
  @Prop(Boolean) countState!: boolean;

  get isRed(): boolean {
    return this.data.type.substring(0, 1) === 'R';
  }

  getChessLabel(type: string): string {
    return CHESS_LIST[type] || '';
  }

  handleClick() {
    const sendData = {
      data: {
        id: this.data.id,
        type: this.data.type,
        isOpen: this.data.isOpen,
        index: this.index,
        count: this.count,
        countState: this.countState,
      },
    };
    this.$emit('pressClick', sendData);
  }

}
</script>