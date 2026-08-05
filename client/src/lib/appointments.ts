export function getStatusColor(status: string) {
  switch (status) {
    case "confirmado":
      return "bg-emerald-100 text-emerald-700";
    case "pendente":
      return "bg-yellow-100 text-yellow-700";
    case "cancelado":
      return "bg-red-100 text-red-700";
    case "falta":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getStatusLabel(status: string) {
  switch (status) {
    case "confirmado":
      return "Confirmado";
    case "pendente":
      return "Pendente";
    case "cancelado":
      return "Cancelado";
    case "falta":
      return "Falta";
    default:
      return status;
  }
}

export function getTipoLabel(tipo: string) {
  switch (tipo) {
    case "consulta":
      return "Consulta";
    case "retorno":
      return "Retorno";
    case "exame":
      return "Exame";
    default:
      return tipo;
  }
}
