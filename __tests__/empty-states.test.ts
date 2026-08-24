import ptBR from '../src/locale/pt-BR.json';
import en from '../src/locale/en.json';
import es from '../src/locale/es.json';
import itLocale from '../src/locale/it.json';

describe('Empty States i18n and Structure Tests', () => {
  it('should have all emptyStates keys defined in pt-BR', () => {
    expect(ptBR.emptyStates).toBeDefined();
    expect(ptBR.emptyStates.myLists.title).toBeTruthy();
    expect(ptBR.emptyStates.myLists.subtitle).toBeTruthy();
    expect(ptBR.emptyStates.myLists.button).toBeTruthy();
    expect(ptBR.emptyStates.emptyList.title).toBeTruthy();
    expect(ptBR.emptyStates.emptyList.subtitle).toBeTruthy();
    expect(ptBR.emptyStates.emptyList.button).toBeTruthy();
    expect(ptBR.emptyStates.emptyList.buttonAI).toBeTruthy();
  });

  it('should have all emptyStates keys defined in en', () => {
    expect(en.emptyStates).toBeDefined();
    expect(en.emptyStates.myLists.title).toBeTruthy();
    expect(en.emptyStates.myLists.subtitle).toBeTruthy();
    expect(en.emptyStates.myLists.button).toBeTruthy();
    expect(en.emptyStates.emptyList.title).toBeTruthy();
    expect(en.emptyStates.emptyList.subtitle).toBeTruthy();
    expect(en.emptyStates.emptyList.button).toBeTruthy();
    expect(en.emptyStates.emptyList.buttonAI).toBeTruthy();
  });

  it('should have all emptyStates keys defined in es', () => {
    expect(es.emptyStates).toBeDefined();
    expect(es.emptyStates.myLists.title).toBeTruthy();
    expect(es.emptyStates.myLists.subtitle).toBeTruthy();
    expect(es.emptyStates.myLists.button).toBeTruthy();
    expect(es.emptyStates.emptyList.title).toBeTruthy();
    expect(es.emptyStates.emptyList.subtitle).toBeTruthy();
    expect(es.emptyStates.emptyList.button).toBeTruthy();
    expect(es.emptyStates.emptyList.buttonAI).toBeTruthy();
  });

  it('should have all emptyStates keys defined in it', () => {
    expect(itLocale.emptyStates).toBeDefined();
    expect(itLocale.emptyStates.myLists.title).toBeTruthy();
    expect(itLocale.emptyStates.myLists.subtitle).toBeTruthy();
    expect(itLocale.emptyStates.myLists.button).toBeTruthy();
    expect(itLocale.emptyStates.emptyList.title).toBeTruthy();
    expect(itLocale.emptyStates.emptyList.subtitle).toBeTruthy();
    expect(itLocale.emptyStates.emptyList.button).toBeTruthy();
    expect(itLocale.emptyStates.emptyList.buttonAI).toBeTruthy();
  });
});
