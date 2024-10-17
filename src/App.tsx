import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Menu from './components/Menu';
import Form from './components/Form';
import Report from './components/Report';
import SavedForms from './components/SavedForms';
import Drafts from './components/Drafts';
import Home from './components/Home';
import { FormData, Draft, Question, Category } from './types';

// Telegram Bot Token and Chat ID
const TELEGRAM_BOT_TOKEN = '7979728776:AAF37aFpjmflfHrW0ykXbbIUTcd57X1X-rc';
const TELEGRAM_CHAT_ID = '763968348';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'form' | 'report' | 'savedForms' | 'drafts'>('home');
  const [language, setLanguage] = useState<'es' | 'pt'>('es');
  const [formData, setFormData] = useState<FormData[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [userName, setUserName] = useState('');
  const [currentDraft, setCurrentDraft] = useState<Draft | null>(null);

  // Sample questions and categories
const questions: Question[] = [
  {
    id: 1,
    text: {
      es: "¿MEO mantiene un inventario actualizado de los activos TIC que soportan los servicios prestados a las entidades financieras?",
      pt: "MEO mantém um inventário atualizado dos ativos TIC que suportam os serviços prestados às entidades financeiras?"
    },
    categoryId: 1,
    options: [
      { text: { es: "Sí", pt: "Sim" }, value: 100 },
      { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
      { text: { es: "No", pt: "Não" }, value: 0 },
      { text: { es: "No sé", pt: "Não sei" }, value: 25 }
    ]
  },
  {
    id: 2,
    text: {
      es: "¿MEO sabe a qué funciones de negocio esos activos dan soporte?",
      pt: "MEO sabe a que funções de negócio esses ativos dão suporte?"
    },
    categoryId: 1,
    options: [
      { text: { es: "Sí", pt: "Sim" }, value: 100 },
      { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
      { text: { es: "No", pt: "Não" }, value: 0 },
      { text: { es: "No sé", pt: "Não sei" }, value: 25 }
    ]
  },
  {
    id: 3,
    text: {
      es: "¿MEO sabe si las funciones de negocio del cliente soportadas son críticas o importantes?",
      pt: "MEO sabe se as funções de negócio do cliente suportadas são críticas ou importantes?"
    },
    categoryId: 1,
    options: [
      { text: { es: "Sí", pt: "Sim" }, value: 100 },
      { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
      { text: { es: "No", pt: "Não" }, value: 0 },
      { text: { es: "No sé", pt: "Não sei" }, value: 25 }
    ]
  },
  {
    id: 4,
    text: {
      es: "¿El cliente tiene acceso? ¿Lo solicitó?",
      pt: "O cliente tem acesso? Solicitou?"
    },
    categoryId: 1,
    options: [
      { text: { es: "Sí", pt: "Sim" }, value: 100 },
      { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
      { text: { es: "No", pt: "Não" }, value: 0 },
      { text: { es: "No sé", pt: "Não sei" }, value: 25 }
    ]
  },
  {
    id: 5,
    text: {
      es: "¿Las funciones de negocio del cliente están documentadas? ¿Se mantienen actualizadas?",
      pt: "As funções de negócio do cliente estão documentadas? Mantêm-se atualizadas?"
    },
    categoryId: 1,
    options: [
      { text: { es: "Sí", pt: "Sim" }, value: 100 },
      { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
      { text: { es: "No", pt: "Não" }, value: 0 },
      { text: { es: "No sé", pt: "Não sei" }, value: 25 }
    ]
  },
  {
    id: 6,
    text: {
      es: "¿Está documentado claramente si los servicios prestados constituyen una externalización completa o parcial y se ha informado a los clientes para que realicen sus evaluaciones de riesgo?",
      pt: "Está documentado claramente se os serviços prestados constituem uma externalização completa ou parcial e foram informados os clientes para que realizem as suas avaliações de risco?"
    },
    categoryId: 1,
    options: [
      { text: { es: "Sí", pt: "Sim" }, value: 100 },
      { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
      { text: { es: "No", pt: "Não" }, value: 0 },
      { text: { es: "No sé", pt: "Não sei" }, value: 25 }
    ]
  },
  {
  id: 7,
  text: {
    es: "¿Se ha identificado y documentado claramente la ubicación de los servicios prestados y gestionados por MEO, así como el lugar donde se almacenarán los datos? ¿Esta información se mantiene actualizada?",
    pt: "Foi identificada e documentada claramente a localização dos serviços prestados e geridos pelo MEO, bem como o local onde os dados serão armazenados? Esta informação é mantida atualizada?"
  },
  categoryId: 2,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 8,
  text: {
    es: "¿MEO tiene conocimiento de que la entidad financiera realiza análisis de riesgos sobre los servicios externalizados? ¿Se ha proporcionado la información necesaria al cliente para apoyar ese análisis?",
    pt: "MEO tem conhecimento de que a entidade financeira realiza análises de risco sobre os serviços externalizados? Foram fornecidas as informações necessárias ao cliente para apoiar essa análise?"
  },
  categoryId: 2,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 9,
  text: {
    es: "¿MEO proporcionó asistencia al cliente en la evaluación de los activos relevantes para el análisis de riesgos, proporcionando información precisa y completa sobre la infraestructura y los servicios que administra?",
    pt: "MEO forneceu assistência ao cliente na avaliação dos ativos relevantes para a análise de riscos, fornecendo informações precisas e completas sobre a infraestrutura e os serviços que administra?"
  },
  categoryId: 2,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 10,
  text: {
    es: "¿El departamento implementó políticas de seguridad de la información que incluyen la gestión de acceso, autenticidad, integridad y confidencialidad de los datos? ¿Están documentadas y se revisan periódicamente?",
    pt: "O departamento implementou políticas de segurança da informação que incluem a gestão de acesso, autenticidade, integridade e confidencialidade dos dados? Estas políticas estão documentadas e são revistas periodicamente?"
  },
  categoryId: 3,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 11,
  text: {
    es: "¿Se ha verificado si el alcance de la certificación ISO 27001 incluye todos los servicios TIC prestados por el departamento de MEO a las entidades financieras? ¿La certificación se mantiene actualizada y alineada con los requisitos de los servicios críticos que ofrece?",
    pt: "Foi verificado se o âmbito da certificação ISO 27001 inclui todos os serviços TIC prestados pelo departamento do MEO às entidades financeiras? A certificação é mantida atualizada e alinhada com os requisitos dos serviços críticos que oferece?"
  },
  categoryId: 3,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 12,
  text: {
    es: "¿Existen cláusulas contractuales que regulan o impiden la subcontratación de servicios por parte de MEO? ¿Esas cláusulas están documentadas y se han comunicado claramente a la entidad financiera?",
    pt: "Existem cláusulas contratuais que regulam ou impedem a subcontratação de serviços pelo MEO? Essas cláusulas estão documentadas e foram claramente comunicadas à entidade financeira?"
  },
  categoryId: 4,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 13,
  text: {
    es: "¿El departamento de MEO ha implementado un proceso formal de evaluación y auditoría de sus subcontratistas, garantizando que cumplen con los requisitos de seguridad y continuidad exigidos?",
    pt: "O departamento do MEO implementou um processo formal de avaliação e auditoria dos seus subcontratantes, garantindo que cumprem com os requisitos de segurança e continuidade que lhes são exigidos?"
  },
  categoryId: 4,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 14,
  text: {
    es: "¿MEO realiza evaluaciones de riesgo iniciales y continuas sobre sus proveedores, garantizando que estos son operativamente resilientes y permiten cumplir con las expectativas regulatorias de las entidades financieras?",
    pt: "MEO realiza avaliações de risco iniciais e contínuas sobre os seus fornecedores, garantindo que estes são operativamente resilientes e permitem cumprir com as expectativas regulatórias das entidades financeiras?"
  },
  categoryId: 4,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 15,
  text: {
    es: "¿El departamento de MEO ha desarrollado y mantiene actualizado un plan de continuidad para los servicios TIC que gestiona, garantizando que los mecanismos de respaldo y recuperación cumplen con los requisitos exigidos por la entidad financiera?",
    pt: "O departamento do MEO desenvolveu e mantém atualizado um plano de continuidade para os serviços TIC que gere, garantindo que os mecanismos de backup e recuperação cumprem os requisitos exigidos pela entidade financeira?"
  },
  categoryId: 5,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 16,
  text: {
    es: "¿Se realizan pruebas periódicas de los planes de continuidad y recuperación, incluidas simulaciones de ciberataques para verificar la eficacia de esos planes?",
    pt: "São realizados testes periódicos dos planos de continuidade e recuperação, incluindo simulações de ciberataques para verificar a eficácia desses planos?"
  },
  categoryId: 5,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 17,
  text: {
    es: "¿Los resultados de las pruebas de resiliencia son revisados para identificar posibles debilidades y se implementan acciones correctivas adecuadas para mejorar la capacidad de respuesta de MEO?",
    pt: "Os resultados dos testes de resiliência são revistos para identificar possíveis fraquezas e são implementadas ações corretivas adequadas para melhorar a capacidade de resposta do MEO?"
  },
  categoryId: 5,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 18,
  text: {
    es: "¿El departamento de MEO cuenta con mecanismos para la detección de actividades anómalas, fallos únicos y vulnerabilidades en los sistemas críticos?",
    pt: "O departamento do MEO possui mecanismos para a deteção de atividades anómalas, falhas únicas e vulnerabilidades nos sistemas críticos?"
  },
  categoryId: 6,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 19,
  text: {
    es: "¿Estos mecanismos están documentados y se realiza una monitorización continua para garantizar la identificación oportuna de cualquier actividad fuera de lo normal?",
    pt: "Esses mecanismos estão documentados e é realizada uma monitorização contínua para garantir a identificação atempada de qualquer atividade fora do normal?"
  },
  categoryId: 6,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 20,
  text: {
    es: "¿Se prueban regularmente los mecanismos de detección?",
    pt: "Os mecanismos de deteção são testados regularmente?"
  },
  categoryId: 6,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 21,
  text: {
    es: "¿Los resultados de esas pruebas son revisados y documentados para garantizar que los mecanismos siguen siendo eficaces contra las nuevas amenazas y vulnerabilidades?",
    pt: "Os resultados desses testes são revistos e documentados para garantir que os mecanismos continuam eficazes contra as novas ameaças e vulnerabilidades?"
  },
  categoryId: 6,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 22,
  text: {
    es: "¿MEO garantiza que el contenido de los contratos corresponde fielmente a lo que fue ofrecido, en lo que respecta al detalle de los servicios prestados a la entidad financiera?",
    pt: "MEO garante que o conteúdo dos contratos corresponde fielmente ao que foi oferecido, no que respeita ao detalhe dos serviços prestados à entidade financeira?"
  },
  categoryId: 7,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 23,
  text: {
    es: "En caso de que los servicios prestados apoyen una función esencial o importante de la entidad financiera, ¿los contratos incluyen las cláusulas adecuadas sobre los niveles de servicio acordados, incluyendo objetivos de desempeño tanto cuantitativos como cualitativos?",
    pt: "No caso de os serviços prestados apoiarem uma função essencial ou importante da entidade financeira, os contratos incluem as cláusulas adequadas sobre os níveis de serviço acordados, incluindo objetivos de desempenho tanto quantitativos como qualitativos?"
  },
  categoryId: 7,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 24,
  text: {
    es: "¿Se han definido claramente las obligaciones de MEO para prestar asistencia técnica y operativa a la entidad financiera en caso de ocurrir un incidente relacionado con los servicios TIC que presta?",
    pt: "Foram claramente definidas as obrigações do MEO para prestar assistência técnica e operacional à entidade financeira no caso de ocorrer um incidente relacionado com os serviços TIC que presta?"
  },
  categoryId: 8,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 25,
  text: {
    es: "¿Esas obligaciones están documentadas en los contratos de servicio, asegurando que los términos de asistencia en situaciones de emergencia han sido acordados?",
    pt: "Essas obrigações estão documentadas nos contratos de serviço, assegurando que os termos de assistência em situações de emergência foram acordados?"
  },
  categoryId: 8,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 26,
  text: {
    es: "¿En los contratos están establecidos los costos aplicables a la asistencia durante incidentes, garantizando que no hay costos adicionales o que estos se acuerdan previamente?",
    pt: "Nos contratos estão estabelecidos os custos aplicáveis à assistência durante incidentes, garantindo que não há custos adicionais ou que são acordados antecipadamente?"
  },
  categoryId: 8,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 27,
  text: {
    es: "¿Esta información ha sido comunicada claramente a la entidad financiera, garantizando que no hay costos inesperados durante situaciones críticas?",
    pt: "Esta informação foi claramente comunicada à entidade financeira, garantindo que não há custos inesperados durante situações críticas?"
  },
  categoryId: 8,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 28,
  text: {
    es: "¿El departamento de MEO tiene procedimientos claros para la gestión de incidentes TIC, que incluyen la notificación a los clientes?",
    pt: "O departamento do MEO tem procedimentos claros para a gestão de incidentes TIC, que incluem a notificação aos clientes?"
  },
  categoryId: 9,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 29,
  text: {
    es: "¿Estos procedimientos están documentados y disponibles para ser revisados por la entidad financiera y se mantienen actualizados?",
    pt: "Esses procedimentos estão documentados e disponíveis para serem revistos pela entidade financeira e são mantidos atualizados?"
  },
  categoryId: 9,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 30,
  text: {
    es: "¿Existen canales de comunicación eficaces para compartir información crítica y coordinarse con otros departamentos de MEO y sus proveedores durante la gestión de incidentes?",
    pt: "Existem canais de comunicação eficazes para partilhar informação crítica e coordenar com outros departamentos do MEO e seus fornecedores durante a gestão de incidentes?"
  },
  categoryId: 9,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 31,
  text: {
    es: "¿Se han implementado mecanismos para compartir información y lecciones aprendidas después de simulaciones o incidentes reales con otras áreas de la empresa para mejorar la respuesta y la resiliencia operativa?",
    pt: "Foram implementados mecanismos para partilhar informação e lições aprendidas após simulações ou incidentes reais com outras áreas da empresa para melhorar a resposta e a resiliência operacional?"
  },
  categoryId: 9,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 32,
  text: {
    es: "¿El departamento de MEO realiza auditorías internas regulares para verificar la eficacia de las políticas de gestión de riesgos TIC y seguridad implementadas?",
    pt: "O departamento do MEO realiza auditorias internas regulares para verificar a eficácia das políticas de gestão de riscos TIC e de segurança implementadas?"
  },
  categoryId: 10,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 33,
  text: {
    es: "¿Los resultados de esas auditorías están documentados y la información recogida se utiliza para mejorar continuamente las políticas y prácticas de gestión de riesgos?",
    pt: "Os resultados dessas auditorias estão documentados e a informação recolhida é utilizada para melhorar continuamente as políticas e práticas de gestão de riscos?"
  },
  categoryId: 10,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 34,
  text: {
    es: "¿El departamento de MEO facilita auditorías periódicas de sus servicios TIC críticos, permitiendo que los clientes financieros y reguladores verifiquen el cumplimiento con el DORA?",
    pt: "O departamento do MEO facilita auditorias periódicas dos seus serviços TIC críticos, permitindo que os clientes financeiros e reguladores verifiquem a conformidade com o DORA?"
  },
  categoryId: 10,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 35,
  text: {
    es: "¿MEO garantiza que toda la información necesaria para auditar esos servicios está disponible y accesible para que los clientes y reguladores puedan realizar una evaluación exhaustiva de su conformidad?",
    pt: "MEO garante que toda a informação necessária para auditar esses serviços está disponível e acessível para que os clientes e reguladores possam realizar uma avaliação exaustiva da sua conformidade?"
  },
  categoryId: 10,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 36,
  text: {
    es: "¿El departamento de MEO ha formado a su personal en los requisitos del Reglamento DORA, en la gestión de riesgos TIC y en los procedimientos de respuesta a incidentes?",
    pt: "O departamento do MEO formou o seu pessoal nos requisitos do Regulamento DORA, na gestão de riscos TIC e nos procedimentos de resposta a incidentes?"
  },
  categoryId: 11,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 37,
  text: {
    es: "¿La formación está documentada, incluyendo los programas y temas tratados, y estos registros se actualizan cuando se realizan nuevas sesiones?",
    pt: "A formação está documentada, incluindo os programas e temas tratados, e esses registos são atualizados quando são realizadas novas sessões?"
  },
  categoryId: 11,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 38,
  text: {
    es: "¿Se realiza un seguimiento continuo de las competencias del personal, asegurando que se mantienen actualizadas ante los cambios en el entorno regulatorio y los riesgos TIC?",
    pt: "É feito um acompanhamento contínuo das competências do pessoal, assegurando que se mantêm atualizadas face às alterações no ambiente regulatório e aos riscos TIC?"
  },
  categoryId: 11,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 39,
  text: {
    es: "¿Alguna entidad financiera ha solicitado que MEO participe en programas de formación específicos desarrollados por la entidad financiera para garantizar que MEO está alineado con los estándares y procedimientos internos del cliente?",
    pt: "Alguma entidade financeira solicitou que o MEO participasse em programas de formação específicos desenvolvidos pela entidade financeira para garantir que o MEO está alinhado com os padrões e procedimentos internos do cliente?"
  },
  categoryId: 11,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 40,
  text: {
    es: "¿MEO ha establecido disposiciones claras y documentadas para garantizar el acceso, recuperación y devolución de datos personales y no personales procesados en caso de insolvencia, resolución, discontinuación de operaciones del proveedor o finalización del acuerdo contractual?",
    pt: "O MEO estabeleceu disposições claras e documentadas para garantir o acesso, recuperação e devolução de dados pessoais e não pessoais processados em caso de insolvência, resolução, descontinuação de operações do fornecedor ou cessação do acordo contratual?"
  },
  categoryId: 12,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 41,
  text: {
    es: "¿Esta información ha sido comunicada de manera transparente a las entidades financieras para garantizar que los clientes son conscientes de los procedimientos que garantizan la continuidad y seguridad de sus datos?",
    pt: "Esta informação foi comunicada de forma transparente às entidades financeiras para garantir que os clientes estão cientes dos procedimentos que garantem a continuidade e segurança dos seus dados?"
  },
  categoryId: 12,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 42,
  text: {
    es: "¿MEO ha definido claramente los derechos de rescisión del contrato con la entidad financiera, asegurando el cumplimiento de los plazos de preaviso mínimos exigidos por las autoridades competentes?",
    pt: "O MEO definiu claramente os direitos de rescisão do contrato com a entidade financeira, assegurando o cumprimento dos prazos de pré-aviso mínimos exigidos pelas autoridades competentes?"
  },
  categoryId: 13,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 43,
  text: {
    es: "¿Se han definido procedimientos específicos para minimizar el impacto operativo en caso de rescisión, garantizando una transición ordenada?",
    pt: "Foram definidos procedimentos específicos para minimizar o impacto operacional em caso de rescisão, garantindo uma transição ordenada?"
  },
  categoryId: 14,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 44,
  text: {
    es: "¿Se ha solicitado a MEO participar en pruebas de penetración basadas en amenazas (TLPT) u otras pruebas similares (TIBER EU), solicitadas por la entidad financiera o los reguladores?",
    pt: "O MEO foi solicitado a participar em testes de penetração baseados em ameaças (TLPT) ou outros testes semelhantes (TIBER EU), solicitados pela entidade financeira ou pelos reguladores?"
  },
  categoryId: 15,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
},
{
  id: 45,
  text: {
    es: "¿Se han definido claramente los mecanismos y acuerdos que garantizan el acceso adecuado a la infraestructura y los datos necesarios para realizar esas pruebas, cumpliendo con los requisitos de seguridad y privacidad establecidos por la entidad financiera?",
    pt: "Foram claramente definidos os mecanismos e acordos que garantem o acesso adequado à infraestrutura e aos dados necessários para realizar esses testes, cumprindo com os requisitos de segurança e privacidade estabelecidos pela entidade financeira?"
  },
  categoryId: 15,
  options: [
    { text: { es: "Sí", pt: "Sim" }, value: 100 },
    { text: { es: "Parcialmente", pt: "Parcialmente" }, value: 50 },
    { text: { es: "No", pt: "Não" }, value: 0 },
    { text: { es: "No sé", pt: "Não sei" }, value: 25 }
  ]
}
];


const categories: Category[] = [
  {
    id: 1,
    name: {
      es: "Localización de servicios y datos",
      pt: "Localização de serviços e dados"
    }
  },
  {
    id: 2,
    name: {
      es: "Análisis de riesgos",
      pt: "Análise de riscos"
    }
  },
  {
    id: 3,
    name: {
      es: "Protección de datos",
      pt: "Proteção de dados"
    }
  },
  {
    id: 4,
    name: {
      es: "Evaluación de subcontratados y proveedores",
      pt: "Avaliação de subcontratados e fornecedores"
    }
  },
  {
    id: 5,
    name: {
      es: "Continuidad del negocio y planes de recuperación",
      pt: "Continuidade do negócio e planos de recuperação"
    }
  },
  {
    id: 6,
    name: {
      es: "Detección y monitorización de actividades anómalas",
      pt: "Deteção e monitorização de atividades anómalas"
    }
  },
  {
    id: 7,
    name: {
      es: "Niveles de Servicio",
      pt: "Níveis de Serviço"
    }
  },
  {
    id: 8,
    name: {
      es: "Asistencia en caso de incidentes",
      pt: "Assistência em caso de incidentes"
    }
  },
  {
    id: 9,
    name: {
      es: "Plazos de notificación y obligaciones de información",
      pt: "Prazos de notificação e obrigações de informação"
    }
  },
  {
    id: 10,
    name: {
      es: "Supervisión y auditorías continuas",
      pt: "Supervisão e auditorias contínuas"
    }
  },
  {
    id: 11,
    name: {
      es: "Aprendizaje y evolución",
      pt: "Aprendizagem e evolução"
    }
  },
  {
    id: 12,
    name: {
      es: "Disposiciones para el acceso, recuperación y devolución de datos",
      pt: "Disposições para o acesso, recuperação e devolução de dados"
    }
  },
  {
    id: 13,
    name: {
      es: "Derechos de rescisión",
      pt: "Direitos de rescisão"
    }
  },
  {
    id: 14,
    name: {
      es: "Estrategias de salida",
      pt: "Estratégias de saída"
    }
  },
  {
    id: 15,
    name: {
      es: "Pruebas TLPT",
      pt: "Testes TLPT"
    }
  }
];


  const sendTelegramMessage = async (data: FormData) => {
    const message = `
New form submitted:
Client: ${data.clientName}
User: ${data.userName}
Date: ${new Date(data.date).toLocaleString()}

Answers:
${Object.entries(data.answers).map(([id, value]) => `Question ${id}: ${value}`).join('\n')}
    `;

    try {
      const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      });
      console.log('Telegram message sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending Telegram message:', error);
    }
  };

  const handleFormSubmit = (data: FormData) => {
    setFormData([...formData, data]);
    sendTelegramMessage(data);
    setCurrentView('report');
  };

  const handleSaveDraft = (draft: Draft) => {
    setDrafts([...drafts, draft]);
    setCurrentView('drafts');
  };

  const handleContinueDraft = (draft: Draft) => {
    setCurrentDraft(draft);
    setCurrentView('form');
  };

  const handleDeleteDraft = (date: string) => {
    setDrafts(drafts.filter(draft => draft.date !== date));
  };

  const handleUpdateForm = (updatedForm: FormData) => {
    setFormData(formData.map(form => form.date === updatedForm.date ? updatedForm : form));
  };

  const handleDeleteForm = (dateToDelete: string) => {
    setFormData(formData.filter(form => form.date !== dateToDelete));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header version="v3.1" userName={userName} language={language} setLanguage={setLanguage} />
      <Menu currentView={currentView} setCurrentView={setCurrentView} language={language} />
      <main className="container mx-auto px-4 py-8">
        {currentView === 'home' && (
          <Home language={language} onStartQuestionnaire={() => setCurrentView('form')} />
        )}
        {currentView === 'form' && (
          <Form
            onSubmit={handleFormSubmit}
            onSaveDraft={handleSaveDraft}
            questions={questions}
            categories={categories}
            language={language}
            userName={userName}
            setUserName={setUserName}
            currentDraft={currentDraft}
          />
        )}
        {currentView === 'report' && (
          <Report formData={formData} questions={questions} categories={categories} language={language} />
        )}
        {currentView === 'savedForms' && (
          <SavedForms
            formData={formData}
            questions={questions}
            categories={categories}
            language={language}
            onUpdateForm={handleUpdateForm}
            onDeleteForm={handleDeleteForm}
          />
        )}
        {currentView === 'drafts' && (
          <Drafts
            drafts={drafts}
            language={language}
            onContinueDraft={handleContinueDraft}
            onDeleteDraft={handleDeleteDraft}
          />
        )}
      </main>
    </div>
  );
};

export default App;