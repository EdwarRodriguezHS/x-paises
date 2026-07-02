import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Clima } from '../../interfaces/pais';

@Injectable({
  providedIn: 'root'
})
export class ClimaService {

  private apiUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http: HttpClient) {}

  obtenerClima(latitud: number, longitud: number): Observable<Clima> {
    const url = `${this.apiUrl}?latitude=${latitud}&longitude=${longitud}&current=temperature_2m,relative_humidity_2m,weather_code`;

    return this.http.get<any>(url).pipe(
      map(data => ({
        temperatura: data.current.temperature_2m,
        humedad: data.current.relative_humidity_2m,
        codigoClima: data.current.weather_code
      }))
    );
  }

  obtenerDescripcionClima(codigo: number): string {
    if (codigo === 0) return '☀️ Despejado';
    if (codigo <= 3) return '⛅ Parcialmente nublado';
    if (codigo <= 49) return '🌫️ Neblina';
    if (codigo <= 69) return '🌧️ Lluvia';
    if (codigo <= 79) return '🌨️ Nieve';
    if (codigo <= 99) return '⛈️ Tormenta';
    return '🌡️ Sin datos';
  }
}