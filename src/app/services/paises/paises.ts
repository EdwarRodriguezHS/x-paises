import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Pais } from '../../interfaces/pais';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private apiUrl = 'https://api.restcountries.com/countries/v5';
  private apiKey = 'rc_live_919ebce893eb41d982a5b92b8f86a5d5';

  constructor(private http: HttpClient) {}

  /**
   * TRAE TODOS LOS PAÍSES (Asegurando el catálogo completo de ~250 países)
   */
  obtenerTodos(): Observable<Pais[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`
    });

    // Añadimos la query para romper la paginación por defecto de la v5
    return this.http.get<any>(`${this.apiUrl}?per_page=250`, { headers }).pipe(
      map(data => this.transformarDatos(data))
    );
  }

  buscarPaises(query: string): Observable<Pais[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`
    });

    return this.http.get<any>(`${this.apiUrl}?q=${query}`, { headers }).pipe(
      map(data => this.transformarDatos(data))
    );
  }

  private transformarDatos(data: any): Pais[] {
    const listaPaises = data?.data?.objects || data?.data || data;

    if (!Array.isArray(listaPaises)) {
      console.warn('Estructura inesperada:', data);
      return [];
    }

    return listaPaises.map((pais: any) => ({
      nombre: pais.names?.common || pais.name?.common || 'Sin nombre',
      bandera: pais.flag?.url_png || pais.flags?.png || '',
      capital: pais.capitals?.[0]?.name || pais.capital?.[0] || 'Sin capital',
      poblacion: pais.population || 0,
      region: pais.region || 'Sin región',
      latitud: pais.capitals?.[0]?.coordinates?.lat || pais.latlng?.[0] || 0,
      longitud: pais.capitals?.[0]?.coordinates?.lng || pais.latlng?.[1] || 0
    }));
  }
}