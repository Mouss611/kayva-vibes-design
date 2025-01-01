import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LocationAutocomplete from "@/components/ui/LocationAutocomplete";
import { UseFormReturn } from "react-hook-form";

interface InstructorFieldsProps {
  form: UseFormReturn<any>;
}

const InstructorFields = ({ form }: InstructorFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="employmentStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Situation professionnelle</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre statut" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="salarié">Salarié</SelectItem>
                <SelectItem value="auto-entrepreneur">Auto-entrepreneur</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse</FormLabel>
            <FormControl>
              <LocationAutocomplete
                value={field.value}
                onChange={(value, placeId) => {
                  field.onChange(value);
                  // You can store placeId in another form field if needed
                }}
                placeholder="Entrez votre adresse"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="preferredLocation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Zone d'activité préférée</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre zone" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="ile-de-france">Île-de-France</SelectItem>
                <SelectItem value="auvergne-rhone-alpes">Auvergne-Rhône-Alpes</SelectItem>
                <SelectItem value="provence-alpes-cote-azur">Provence-Alpes-Côte d'Azur</SelectItem>
                <SelectItem value="occitanie">Occitanie</SelectItem>
                <SelectItem value="nouvelle-aquitaine">Nouvelle-Aquitaine</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="teachingHours"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Disponibilité d'enseignement</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez vos disponibilités" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="temps-plein">Temps Plein</SelectItem>
                <SelectItem value="temps-partiel">Temps Partiel</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default InstructorFields;