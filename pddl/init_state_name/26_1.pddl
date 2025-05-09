(define (problem scene1)
  (:domain manip)
  (:objects
    black pen - item
    blue marker - item
    USB drive - item
    stapler - item
  )
  (:init
    (ontable black pen)
    (ontable blue marker)
    (ontable USB drive)
    (ontable stapler)
    (clear black pen)
    (clear blue marker)
    (clear USB drive)
    (clear stapler)
    (handempty)
  )
  (:goal (and ))
)