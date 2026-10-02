import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it } from 'vitest'
import MemoryGame from '@/components/lesson/MemoryGame.vue'

function setup() {
  return mount(MemoryGame, { global: { plugins: [createI18n({ legacy: false, locale: 'en' })] } })
}
describe('memory mission', () => {
  it.each(['list', 'string'])(
    'shows references correctly for %s and resets the prediction',
    async (mode) => {
      const wrapper = setup()
      const click = async (label: string) => {
        const button = wrapper.findAll('button').find((item) => item.text() === label)!
        await button.trigger('click')
      }
      if (mode === 'string') await click('Immutable string')
      await click('Run next line')
      await click('Run next line')
      expect(wrapper.findAll('.binding').map((item) => item.text())).toEqual(['a → O1', 'b → O1'])
      expect(
        wrapper
          .findAll('button')
          .find((item) => item.text() === 'Reveal & run line 3')!
          .attributes('disabled')
      ).toBeDefined()
      await click(mode === 'list' ? '[1, 2, 3]' : '"Felix"')
      await click('Reveal & run line 3')
      expect(wrapper.text()).toContain('Correct!')
      expect(wrapper.findAll('.binding').map((item) => item.text())).toEqual([
        mode === 'list' ? 'a → O1' : 'a → O2',
        'b → O1'
      ])
      expect(wrapper.findAll('.object')).toHaveLength(mode === 'list' ? 1 : 2)
      await click('Back')
      expect(
        wrapper
          .findAll('button')
          .find((item) => item.text() === 'Reveal & run line 3')!
          .attributes('disabled')
      ).toBeDefined()
      await click('Restart')
      expect(wrapper.findAll('.object')).toHaveLength(0)
      expect(wrapper.findAll('.binding')).toHaveLength(0)
    }
  )
})
