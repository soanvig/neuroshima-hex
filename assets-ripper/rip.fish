#!/usr/bin/fish

set fileDir "assets/gfx"
set factions borgo dancer deathbreath doomsdaymachine hegemonia irongang mephisto missisipi moloch neodzungla nowyjork posterunek sandrunners sharrash smart stalowapolicja troglodyci uranopolis vegas

for faction in $factions
	wget -nH -r -l1 --no-parent -N -P assets --show-progress --no-verbose https://neuroshimahex.pl/gfx/$faction/
end

find assets -name "*.html*" -exec rm -r "{}" \;

# Manual fixes
convert ./assets/gfx/irongang/irongang-hak.jpg ./assets/gfx/irongang/irongang-hak.png

# Create mask
convert -size 150x140 xc:none -fill black -draw "polygon 45,15 105,15 137,70 105,123 45,123 12,70" mask.png

for file in (find assets -name "*.png" -exec echo "{}" \;)
    set filename (basename $file)
    set faction (basename (dirname $file))
    set result "results/$faction/$filename"

    mkdir -p results/$faction
    convert $file -alpha set \
        mask.png -compose DstIn -composite \
        $result

    convert -crop 125x108+12+15 \
        $result \
        $result

    echo "Processed $faction/$filename"
end
